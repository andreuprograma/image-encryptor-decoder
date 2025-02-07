
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCw, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CryptoJS from "crypto-js";

export const EncryptTab = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [seedWord, setSeedWord] = useState("");
  const [rotation, setRotation] = useState(0);
  const [encryptedData, setEncryptedData] = useState<{
    data: string;
    size: number;
  } | null>(null);
  const [fileName, setFileName] = useState("");
  const [lastEncryptedImage, setLastEncryptedImage] = useState<string | null>(null);
  const [lastUsedSeed, setLastUsedSeed] = useState<string>("");

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageSelect(file);
    } else {
      toast({
        variant: "destructive",
        description: "Por favor, selecciona un archivo de imagen válido",
      });
    }
  };

  const handleImageSelect = (file: File) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFileName(`${file.name}.enc`);
    setEncryptedData(null);
    setLastEncryptedImage(null);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const rotate = (direction: "left" | "right") => {
    setRotation(prev => direction === "right" ? prev + 90 : prev - 90);
  };

  const handleEncrypt = async () => {
    if (!image || !seedWord) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const encrypted = CryptoJS.AES.encrypt(base64, seedWord).toString();
        const encryptedSize = new Blob([encrypted]).size;
        
        setEncryptedData({
          data: encrypted,
          size: encryptedSize
        });
        setLastEncryptedImage(base64);
        setLastUsedSeed(seedWord);

        toast({
          description: "Imagen encriptada correctamente ✨",
        });
      };

      reader.readAsDataURL(image);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error al encriptar la imagen",
      });
    }
  };

  const handleDownload = () => {
    if (!encryptedData) return;
    
    const blob = new Blob([encryptedData.data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      description: "Archivo encriptado descargado correctamente 💾",
    });
  };

  const isEncryptDisabled = !image || !seedWord || (
    lastEncryptedImage === previewUrl && lastUsedSeed === seedWord
  );

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleImageDrop}
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
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 object-contain transition-transform duration-300"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  rotate("left");
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  rotate("right");
                }}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            {image && (
              <p className="text-sm text-gray-500">
                Tamaño original: {(image.size / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">
            Arrastra y suelta una imagen aquí o haz clic para seleccionar
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="seed-word" className="text-sm font-medium">
          Palabra Semilla
        </label>
        <Input
          id="seed-word"
          type="text"
          value={seedWord}
          onChange={(e) => setSeedWord(e.target.value)}
          placeholder="Introduce la palabra semilla"
        />
      </div>

      {encryptedData && (
        <div className="space-y-2">
          <label htmlFor="file-name" className="text-sm font-medium">
            Nombre del archivo encriptado
          </label>
          <Input
            id="file-name"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="nombre_archivo.enc"
          />
          <p className="text-sm text-gray-500">
            Tamaño encriptado: {(encryptedData.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={handleEncrypt}
          disabled={isEncryptDisabled}
          className="flex-1"
        >
          Encriptar
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={!encryptedData}
          className="flex-1"
        >
          Descargar
        </Button>
      </div>
    </div>
  );
};
