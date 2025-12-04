'use client';

import { type FC, type ChangeEvent } from 'react';
import Button from '../ui/Button';

interface SettingsFormProps {
    customLogo: string | null;
    onLogoUpdate: (base64: string | null) => void;
    onSuccess: (msg: string) => void;
}

export const SettingsForm: FC<SettingsFormProps> = ({ customLogo, onLogoUpdate, onSuccess }) => {
    
    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                localStorage.setItem('retro_custom_logo', base64String);
                onLogoUpdate(base64String);
                onSuccess("LOGO UPDATED SUCCESSFULLY. (Local Override)");
                
                // Trigger global storage event for other tabs/components
                window.dispatchEvent(new Event('storage'));
                setTimeout(() => window.location.reload(), 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        localStorage.removeItem('retro_custom_logo');
        onLogoUpdate(null);
        window.location.reload();
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-xs text-retro-neon border-b border-gray-700 pb-2 mb-4 font-bold uppercase tracking-widest">Global Assets</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                    <label className="block text-sm font-bold mb-2 text-retro-blue">CUSTOM LOGO UPLOAD</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:bg-retro-grid file:text-retro-neon hover:file:bg-retro-neon hover:file:text-black"
                    />
                    {customLogo && (
                        <div className="mt-4">
                            <Button variant="danger" onClick={handleReset} className="text-xs">
                                RESET TO DEFAULT LOGO
                            </Button>
                        </div>
                    )}
                </div>
                <div className="bg-black/50 border border-gray-700 p-8 flex flex-col items-center justify-center min-h-[200px]">
                    <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest">Preview</p>
                    {customLogo ? (
                        <img src={customLogo} alt="Logo Preview" className="h-24 w-auto object-contain" />
                    ) : (
                        <div className="text-gray-600 font-pixel text-sm">NO CUSTOM LOGO</div>
                    )}
                </div>
            </div>
        </div>
    );
};