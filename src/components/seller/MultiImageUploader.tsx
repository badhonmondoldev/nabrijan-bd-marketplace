'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Star, Image as ImageIcon, Plus } from 'lucide-react';

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUploader({
  images,
  onChange,
  maxImages = 10,
}: MultiImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onChange([...images, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const cover = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([cover, ...rest]);
  };

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
        <span className="flex items-center space-x-1.5">
          <ImageIcon className="w-4 h-4 text-pink-400" />
          <span>Product Images & Gallery ({images.length} / {maxImages})</span>
        </span>
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-rose-400 hover:underline font-semibold"
          >
            Clear All Photos
          </button>
        )}
      </div>

      {/* Drag & Drop Zone */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
            dragActive
              ? 'border-pink-500 bg-pink-950/40'
              : 'border-slate-800 bg-slate-950 hover:border-pink-500/50 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          <div className="w-12 h-12 rounded-2xl bg-pink-950 border border-pink-500/40 text-pink-300 flex items-center justify-center shadow-lg">
            <UploadCloud className="w-6 h-6 text-pink-400" />
          </div>

          <div>
            <div className="text-xs font-black text-white">
              Tap to choose multiple photos from gallery or drag & drop
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Supports PNG, JPG, WEBP up to 10MB per photo
            </div>
          </div>

          <button
            type="button"
            className="mt-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs px-4 py-2 rounded-xl shadow"
          >
            Select Photos From Device
          </button>
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-square shadow-lg"
            >
              <img
                src={img}
                alt={`Product photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover Badge */}
              {idx === 0 ? (
                <span className="absolute top-2 left-2 bg-pink-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow flex items-center space-x-1">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  <span>COVER PHOTO</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setAsCover(idx)}
                  className="absolute top-2 left-2 bg-slate-950/80 hover:bg-pink-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                >
                  Set as Cover
                </button>
              )}

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 rounded-2xl aspect-square flex flex-col items-center justify-center text-slate-500 hover:text-pink-400 hover:border-pink-500/50 transition bg-slate-950"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Add Photo</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
