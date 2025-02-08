import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CryptoJS from "crypto-js";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { useEncrypt } from "@/context/EncryptContext";
import { ImageUploadArea } from "./encrypt/ImageUploadArea";
import { SeedWordInput } from "./encrypt/SeedWordInput";
import { FileNameInput } from "./encrypt/FileNameInput";
import { NotificationDialog } from "./encrypt/NotificationDialog";

export const EncryptTab = () => {
  const { 
    seedWord, 
    setSeedWord, 
    imageFile, 
    setImageFile,
    previewUrl,
    setPreviewUrl,
    rotation,
    setRotation 
  } = useEncrypt();
  
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
  const [showSeedWord, setShowSeedWord] = useState(false);

  const showMessage = (title: string, description: string) => {
    setDialogMessage({ title, description });
    setShowDialog(true);
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
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

  const handleEncrypt = async () => {
    if (!imageFile || !seedWord) return;

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

      reader.readAsDataURL(imageFile);
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
    setImageFile(null);
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

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const isEncryptDisabled = !imageFile || 
    !seedWord || 
    encryptedData !== null || // Desactivar si ya se ha encriptado
    (hasDownloaded && lastDownloadData?.seedWord === seedWord); // Desactivar si ya se ha descargado

  const isDownloadDisabled = !encryptedData || 
    (hasDownloaded && 
    lastDownloadData?.seedWord === seedWord && 
    lastDownloadData?.fileName === fileName);

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <NotificationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={dialogMessage.title}
        description={dialogMessage.description}
      />

      <ImageUploadArea
        previewUrl={previewUrl}
        rotation={rotation}
        imageFile={imageFile}
        onImageSelect={handleImageSelect}
        onRotate={(direction: "left" | "right") => {
          setRotation(direction === "right" ? rotation + 90 : rotation - 90);
        }}
      />

      <SeedWordInput
        seedWord={seedWord}
        onChange={setSeedWord}
        showSeedWord={showSeedWord}
        onToggleVisibility={() => setShowSeedWord(!showSeedWord)}
      />

      {encryptedData && (
        <FileNameInput
          fileName={fileName}
          onChange={setFileName}
          encryptedSize={encryptedData.size}
        />
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
