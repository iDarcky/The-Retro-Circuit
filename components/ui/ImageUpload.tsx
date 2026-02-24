'use client';

import { useState, useRef, type ChangeEvent, type DragEvent, type KeyboardEvent, type FC } from 'react';
import { supabase } from '../../lib/supabase/singleton';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

const ImageUpload: FC<ImageUploadProps> = ({ value, onChange, disabled, className = "" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('INVALID FILE TYPE. PLEASE UPLOAD AN IMAGE.');
      return;
    }

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `public/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('hardware-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('hardware-images')
        .getPublicUrl(fileName);

      onChange(data.publicUrl);
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`UPLOAD FAILED: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {value ? (
        <div className="relative group border border-white/10 bg-bg-primary p-2">
            <div className="aspect-video w-full relative flex items-center justify-center bg-zinc-950">
                <img 
                    src={value} 
                    alt="Upload" 
                    className="max-h-48 w-auto object-contain"
                />
            </div>
            <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="absolute top-0 right-0 bg-white text-black w-6 h-6 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors z-10 font-mono text-xs font-bold"
                title="Remove Image"
                aria-label="Remove Image"
            >
                X
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/90 px-2 py-1 border-t border-white/10 text-[9px] font-mono text-zinc-400 truncate">
                {value.split('/').pop()}
            </div>
        </div>
      ) : (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Upload image"
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
            className={`
                relative h-24 border flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-none
                ${isDragging 
                    ? 'border-white bg-white/5'
                    : 'border-white/10 bg-bg-primary hover:border-white/30 hover:bg-white/5'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
            `}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={disabled || isUploading}
                className="hidden"
                tabIndex={-1}
            />
            
            {isUploading ? (
                <div className="text-center flex flex-col items-center gap-2">
                     <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                     <span className="font-mono text-[10px] text-zinc-400">UPLOADING...</span>
                </div>
            ) : (
                <div className="text-center p-2 flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 group-hover:text-white transition-colors">
                        {isDragging ? '[ DROP HERE ]' : '[ + UPLOAD IMAGE ]'}
                    </span>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
