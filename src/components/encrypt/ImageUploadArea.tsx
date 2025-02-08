
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, RotateCcw, Upload } from "lucide-react";

interface ImageUploadAreaProps {
  previewUrl: string;
  rotation: number;
  imageFile: File | null;
  onImageSelect: (file: File) => void;
  onRotate: (direction: "left" | "right") => void;
  isEncrypted?: boolean;
}

export const ImageUploadArea = ({
  previewUrl,
  rotation,
  imageFile,
  onImageSelect,
  onRotate,
  isEncrypted = false,
}: ImageUploadAreaProps) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        type="file"
        id="file-input"
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
      {previewUrl ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <img
              src={previewUrl}
              alt="Preview"
              className={`max-h-64 object-contain transition-opacity duration-[3s] ${
                isEncrypted ? 'opacity-100 animate-[opacity-pulse_3s_ease-in-out_infinite]' : ''
              }`}
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <div className="absolute top-0 left-0 right-0 flex justify-center gap-2 -mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onRotate("left");
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onRotate("right");
                }}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {imageFile && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Archivo: {imageFile.name}
              </p>
              <p className="text-sm text-gray-500">
                Tamaño original: {(imageFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500">
            Selecciona una imagen para encriptar
          </p>
        </div>
      )}
    </div>
  );
};
