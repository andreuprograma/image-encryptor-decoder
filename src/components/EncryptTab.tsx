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
import { Share2 } from "lucide-react";

export const EncryptTab = () => {
  const { 
    seedWord, 
    setSeedWord, 
    imageFile, 
    setImageFile,
    previewUrl,
    setPreviewUrl,
    rotation,
    setRotation,
    encryptedData,
    setEncryptedData,
    fileName,
    setFileName,
    lastEncryptedImage,
    setLastEncryptedImage,
    lastUsedSeed,
    setLastUsedSeed,
    hasDownloaded,
    setHasDownloaded,
    isEncrypted,
    setIsEncrypted,
    downloadedFileName,
    setDownloadedFileName
  } = useEncrypt();
  
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ title: "", description: "" });
  const [lastDownloadData, setLastDownloadData] = useState<{
    seedWord: string;
    fileName: string;
  } | null>(null);
  const [showSeedWord, setShowSeedWord] = useState(false);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      setIsEncrypted(false);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile, setPreviewUrl, setIsEncrypted]);

  useEffect(() => {
    setEncryptedData(null);
    setLastEncryptedImage(null);
    setHasDownloaded(false);
    setLastDownloadData(null);
    setIsEncrypted(false);
    setDownloadedFileName("");
  }, [seedWord]);

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
    
    const baseFileName = file.name.split('.')[0];
    setFileName(baseFileName);
    
    setEncryptedData(null);
    setLastEncryptedImage(null);
    setHasDownloaded(false);
    setLastDownloadData(null);
    setIsEncrypted(false);
    setDownloadedFileName("");
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
        setIsEncrypted(true);
      };

      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error('Error al encriptar:', error);
    }
  };

  const handleDownload = async () => {
    if (!encryptedData) return;
    
    try {
      const finalFileName = `${fileName}.enc`;
      
      if (Capacitor.isNativePlatform()) {
        await Filesystem.writeFile({
          path: `Download/${finalFileName}`,
          data: encryptedData.data,
          directory: Directory.ExternalStorage,
          recursive: true
        });
      } 
      else {
        const blob = new Blob([encryptedData.data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      setHasDownloaded(true);
      setLastDownloadData({
        seedWord,
        fileName: finalFileName
      });
      setDownloadedFileName(finalFileName);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleShare = async () => {
    if (!encryptedData) return;

    try {
      const finalFileName = `${fileName}.enc`;
      const blob = new Blob([encryptedData.data], { type: 'application/octet-stream' });
      const file = new File([blob], finalFileName, { type: 'application/octet-stream' });

      // Intento 1: Compartir como archivo
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Compartir imagen encriptada',
            text: '¡Te comparto esta imagen encriptada!'
          });
          return;
        } catch (error) {
          if ((error as Error).name === 'AbortError') return;
          console.log('Compartir archivo no soportado, intentando compartir URL...');
        }
      }

      // Intento 2: Compartir solo texto y URL
      try {
        await navigator.share({
          title: 'Compartir imagen encriptada',
          text: '¡Te comparto esta imagen encriptada!',
          url: window.location.href
        });
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.log('Compartir URL no soportado, copiando al portapapeles...');
        
        // Intento 3: Copiar al portapapeles
        try {
          await navigator.clipboard.writeText(encryptedData.data);
          showMessage(
            "Archivo copiado", 
            "Tu navegador no soporta compartir directamente, pero el contenido se ha copiado al portapapeles. Puedes pegarlo donde necesites."
          );
          return;
        } catch (clipboardError) {
          showMessage(
            "Error al compartir", 
            "Tu navegador no soporta compartir ni copiar al portapapeles. Intenta guardar el archivo y compartirlo manualmente."
          );
        }
      }
    } catch (error) {
      showMessage(
        "Error al compartir", 
        "Ocurrió un error al intentar compartir. Intenta guardar el archivo y compartirlo manualmente."
      );
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
    setIsEncrypted(false);
    setDownloadedFileName("");
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const isEncryptDisabled = !imageFile || !seedWord;

  const isDownloadDisabled = !encryptedData || 
    (hasDownloaded && 
    lastDownloadData?.seedWord === seedWord && 
    lastDownloadData?.fileName === `${fileName}.enc`);

  const isClearDisabled = !imageFile && !seedWord && !encryptedData && !fileName;

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
        isEncrypted={isEncrypted}
        downloadedFileName={downloadedFileName}
        encryptedSize={encryptedData?.size}
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
          variant="secondary"
          onClick={handleShare}
          disabled={!encryptedData}
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
        <Button
          variant="secondary"
          onClick={handleClear}
          disabled={isClearDisabled}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      </div>
    </div>
  );
};
