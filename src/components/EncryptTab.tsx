import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCw, RotateCcw, Eye, EyeOff, X, Upload } from "lucide-react";
import CryptoJS from "crypto-js";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const EncryptTab = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [seedWord, setSeedWord] = useState("");
  const [showSeedWord, setShowSeedWord] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [encryptedData, setEncryptedData] = useState<{
    data: string;
    size: number;
  } | null>(null);
  const [fileName, setFileName] = useState("");
  const [lastEncryptedImage, setLastEncryptedImage] = useState<string | null>(null);
  const [lastUsedSeed, setLastUsedSeed] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ title: "", description: "" });
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [lastDownloadData, setLastDownloadData] = useState<{
    seedWord: string;
    fileName: string;
  } | null>(null);

  const showMessage = (title: string, description: string) => {
    setDialogMessage({ title, description });
    setShowDialog(true);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageSelect(file);
    } else {
      showMessage("Error", "Por favor, selecciona un archivo de imagen válido");
    }
  };

  const handleImageSelect = (file: File) => {
    setImage(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFileName(`${file.name}.enc`);
    setEncryptedData(null);
    setLastEncryptedImage(null);
    setHasDownloaded(false);
    setLastDownloadData(null);
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

        showMessage("Éxito", "Imagen encriptada correctamente ✨");
      };

      reader.readAsDataURL(image);
    } catch (error) {
      showMessage("Error", "Error al encriptar la imagen");
    }
  };

  const handleDownload = async () => {
    if (!encryptedData) return;
    
    try {
      if (Capacitor.isNativePlatform()) {
        await Filesystem.writeFile({
          path: `Download/${fileName}`,
          data: encryptedData.data,
          directory: Directory.ExternalStorage,
          recursive: true
        });
        
        showMessage("Éxito", "Archivo guardado en Descargas/Downloads 💾");
      } 
      else {
        const blob = new Blob([encryptedData.data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showMessage("Éxito", "Archivo descargado correctamente 💾");
      }
      setHasDownloaded(true);
      setLastDownloadData({
        seedWord,
        fileName
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      showMessage("Error", "Error al guardar el archivo");
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreviewUrl("");
    setSeedWord("");
    setRotation(0);
    setEncryptedData(null);
    setFileName("");
    setLastEncryptedImage(null);
    setLastUsedSeed("");
    setHasDownloaded(false);
    setLastDownloadData(null);
    showMessage("Éxito", "Campos limpiados correctamente");
  };

  const isEncryptDisabled = !image || !seedWord;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const isDownloadDisabled = !encryptedData || 
    (hasDownloaded && 
    lastDownloadData?.seedWord === seedWord && 
    lastDownloadData?.fileName === fileName);

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogMessage.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDialog(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <div className="relative w-full max-w-md">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 object-contain transition-transform duration-300 mx-auto"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
              <div className="absolute top-0 left-0 right-0 flex justify-center gap-2 -mt-8">
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
            </div>
            {image && (
              <p className="text-sm text-gray-500">
                Tamaño original: {(image.size / 1024).toFixed(2)} KB
              </p>
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

      <div className="space-y-2">
        <label htmlFor="seed-word" className="text-sm font-medium">
          Palabra Semilla
        </label>
        <div className="relative">
          <Input
            id="seed-word"
            type={showSeedWord ? "text" : "password"}
            value={seedWord}
            onChange={(e) => setSeedWord(e.target.value)}
            placeholder="Introduce la palabra semilla"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowSeedWord(!showSeedWord)}
          >
            {showSeedWord ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
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

      <div className="flex flex-wrap gap-2">
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
          disabled={isDownloadDisabled}
          className="flex-1"
        >
          Descargar
        </Button>
        <Button
          variant="destructive"
          onClick={handleClear}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      </div>
    </div>
  );
};
