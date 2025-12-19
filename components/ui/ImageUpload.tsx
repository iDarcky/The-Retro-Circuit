'use client';

import { useState, useRef, type ChangeEvent, type DragEvent, type FC } from 'react';
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

  return (
    <div className={`w-full ${className}`}>
      {value ? (
        <div className="relative group border border-border-normal bg-black/40 p-2">
            <div className="aspect-video w-full relative flex items-center justify-center bg-[linear-gradient(45deg,#0f0f1b_25%,transparent_25%,transparent_75%,#0f0f1b_75%,#0f0f1b),linear-gradient(45deg,#0f0f1b_25%,transparent_25%,transparent_75%,#0f0f1b_75%,#0f0f1b)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
                <img 
                    src={value} 
                    alt="Upload" 
                    className="max-h-48 w-auto object-contain drop-shadow-lg" 
                />
            </div>
            <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="absolute top-2 right-2 bg-accent text-white w-8 h-8 flex items-center justify-center border border-white hover:bg-red-600 transition-colors shadow-lg z-10"
                title="Remove Image"
            >
                X
            </button>
            <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 border border-border-normal text-[9px] font-mono text-secondary truncate max-w-[90%]">
                {value.split('/').pop()}
            </div>
        </div>
      ) : (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                relative h-32 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                ${isDragging 
                    ? 'border-secondary bg-secondary/10 scale-[1.02]'
                    : 'border-gray-700 bg-black/20 hover:border-primary hover:bg-black/40'
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
            />
            
            {isUploading ? (
                <div className="text-center">
                     <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                     <span className="font-pixel text-[10px] text-secondary animate-pulse">UPLOADING DATA...</span>
                </div>
            ) : (
                <div className="text-center p-4">
                    <svg className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-secondary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="font-pixel text-[10px] text-gray-400 mb-1">
                        {isDragging ? 'DROP FILE TO UPLOAD' : 'CLICK OR DRAG IMAGE'}
                    </div>
                    <div className="font-mono text-[9px] text-gray-600">
                        SUPPORTS JPG, PNG, WEBP
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
