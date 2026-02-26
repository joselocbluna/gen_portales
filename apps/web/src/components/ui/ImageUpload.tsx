import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, X } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "URL o Imagen" }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Note: Update URL if deployed
            const res = await fetch('http://localhost:3002/storage/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Error al subir la imagen');
            const data = await res.json();

            if (data.url) {
                onChange(data.url);
            }
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Error uploading file');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    className="flex-1 px-3 py-1.5 bg-[#1e293b] border border-[#334155] rounded text-sm text-slate-200 outline-none focus:border-[#3b82f6]"
                    placeholder="https://..."
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                />

                <div className="relative cursor-pointer w-10 h-8 flex items-center justify-center bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded transition-colors group">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <UploadCloud className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    )}
                </div>
            </div>

            {error && <span className="text-xs text-red-400">{error}</span>}

            {value && (
                <div className="relative mt-2 rounded border border-[#334155] overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Preview" className="w-full h-24 object-cover" />
                    <button
                        onClick={() => onChange('')}
                        className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 right-1 text-green-400 bg-black/70 rounded-full p-1">
                        <CheckCircle2 className="w-3 h-3" />
                    </div>
                </div>
            )}
        </div>
    );
};
