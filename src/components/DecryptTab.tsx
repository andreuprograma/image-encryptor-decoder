import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Eye, EyeOff, X, Upload, Share2 } from "lucide-react";
import CryptoJS from "crypto-js";
import { Filesystem, Directory } from '@capacitor/filesystem';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEncrypt } from "@/context/EncryptContext";
import { ImageUploadArea } from "./encrypt/ImageUploadArea";

export const DecryptTab = () => {
  const { seedWord, setSeedWord, encryptedFile, setEncryptedFile } = useEncrypt();
  const [encFile, setEncFile] = useState<File | null>(null);
  const [showSeedWord, setShowSeedWord] = useState(false);
  const [decryptedImage, setDecryptedImage] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [fileSizes, setFileSizes] = useState<{
    encrypted: number;
    decrypted: number;
  } | null>(null);
  const [lastEncryptedContent, setLastEncryptedContent] = useState<string | null>(null);
  const [lastUsedSeed, setLastUsedSeed] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ title: "", description: "" });
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [lastDownloadData, setLastDownloadData] = useState<{
    seedWord: string;
    fileName: string;
  } | null>(null);

  useEffect(() => {
    if (encryptedFile) {
      handleFileSelect(encryptedFile);
    }
  }, [encryptedFile]);

  const showMessage = (title: string, description: string) => {
    setDialogMessage({ title, description });
    setShowDialog(true);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.enc')) {
      handleFileSelect(file);
    } else {
      showMessage("Error", "Por favor, selecciona un archivo .enc válido");
    }
  };

  const handleFileSelect = (file: File) => {
    setEncFile(file);
    setEncryptedFile(file);
    const baseFileName = file.name.replace('.enc', '');
    setFileName(baseFileName);
    setFileSizes(prev => prev ? { ...prev, encrypted: file.size } : { encrypted: file.size, decrypted: 0 });
    setDecryptedImage("");
    setLastEncryptedContent(null);
    setHasDownloaded(false);
    setLastDownloadData(null);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.enc')) {
      handleFileSelect(file);
    } else if (file) {
      showMessage("Error", "Por favor, selecciona un archivo .enc válido");
    }
  };

  const handleDecrypt = async () => {
    if (!encFile || !seedWord) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const encrypted = e.target?.result as string;
        
        try {
          const decrypted = CryptoJS.AES.decrypt(encrypted, seedWord).toString(CryptoJS.enc.Utf8);
          
          if (!decrypted) {
            throw new Error("Palabra semilla incorrecta");
          }

          setDecryptedImage(decrypted);
          const decryptedSize = new Blob([decrypted]).size;
          setFileSizes(prev => prev ? { ...prev, decrypted: decryptedSize } : { encrypted: encFile.size, decrypted: decryptedSize });
          setLastEncryptedContent(encrypted);
          setLastUsedSeed(seedWord);
        } catch (error) {
          setDecryptedImage("");
          showMessage("Error", "Palabra semilla incorrecta o archivo corrupto");
        }
      };

      reader.readAsText(encFile);
    } catch (error) {
      showMessage("Error", "Error al desencriptar la imagen");
    }
  };

  const handleDownloadDecrypted = async () => {
    if (!decryptedImage) return;
    
    try {
      const finalFileName = fileName;
      const base64Data = decryptedImage.split(',')[1];
      
      await Filesystem.writeFile({
        path: `Download/${finalFileName}`,
        data: base64Data,
        directory: Directory.ExternalStorage,
        recursive: true
      });
      
      setHasDownloaded(true);
      setLastDownloadData({
        seedWord,
        fileName: finalFileName
      });

    } catch (error) {
      console.error('Error al guardar:', error);
      showMessage("Error", "No se pudo guardar la imagen en el dispositivo");
    }
  };

  const handleClear = () => {
    setEncFile(null);
    setSeedWord("");
    setDecryptedImage("");
    setFileName("");
    setFileSizes(null);
    setLastEncryptedContent(null);
    setLastUsedSeed("");
    setHasDownloaded(false);
    setLastDownloadData(null);
  };

  const handleShare = async () => {
    if (!decryptedImage) return;

    try {
      // Intento 1: Compartir como archivo
      const response = await fetch(decryptedImage);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Compartir imagen',
            text: '¡Te comparto esta imagen!'
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
          title: 'Compartir imagen',
          text: '¡Te comparto esta imagen!',
          url: window.location.href
        });
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.log('Compartir URL no soportado, copiando al portapapeles...');
        
        // Intento 3: Copiar al portapapeles
        try {
          await navigator.clipboard.writeText(decryptedImage);
          showMessage(
            "Imagen copiada", 
            "Tu navegador no soporta compartir directamente, pero la imagen se ha copiado al portapapeles. Puedes pegarla donde necesites."
          );
          return;
        } catch (clipboardError) {
          showMessage(
            "Error al compartir", 
            "Tu navegador no soporta compartir ni copiar al portapapeles. Intenta guardar la imagen y compartirla manualmente."
          );
        }
      }
    } catch (error) {
      showMessage(
        "Error al compartir", 
        "Ocurrió un error al intentar compartir. Intenta guardar la imagen y compartirla manualmente."
      );
    }
  };

  const isDecryptDisabled = !encFile || 
    !seedWord || 
    decryptedImage !== "" || 
    (hasDownloaded && lastDownloadData?.seedWord === seedWord);

  const isDownloadDisabled = !decryptedImage || 
    (hasDownloaded && 
    lastDownloadData?.seedWord === seedWord && 
    lastDownloadData?.fileName === fileName);

  const renderLogMessage = () => {
    if (!encFile && !lastEncryptedContent) return null;

    return (
      <div className="mt-4 space-y-2 text-sm text-gray-500">
        {encFile && (
          <>
            <p>✓ Archivo cargado: {encFile.name}</p>
            {fileSizes?.encrypted && (
              <p>✓ Tamaño archivo encriptado: {(fileSizes.encrypted / 1024).toFixed(2)} KB</p>
            )}
          </>
        )}
        {decryptedImage && fileSizes?.decrypted && (
          <p>✓ Archivo desencriptado ({(fileSizes.decrypted / 1024).toFixed(2)} KB)</p>
        )}
        {hasDownloaded && (
          <p>✓ Imagen descargada como: {fileName}</p>
        )}
      </div>
    );
  };

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
        onDrop={handleFileDrop}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => document.getElementById("enc-file-input")?.click()}
      >
        <input
          type="file"
          id="enc-file-input"
          className="hidden"
          accept=".enc"
          onChange={handleFileInput}
        />
        {encFile ? (
          <div>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            {renderLogMessage()}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="text-gray-500">
              Selecciona un archivo .enc para desencriptar
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="decrypt-seed-word" className="text-sm font-medium">
          Palabra Semilla
        </label>
        <div className="relative">
          <Input
            id="decrypt-seed-word"
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

      {decryptedImage && (
        <div className="space-y-2">
          <label htmlFor="decrypted-file-name" className="text-sm font-medium">
            Nombre del archivo descargado
          </label>
          <Input
            id="decrypted-file-name"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="nombre_archivo"
          />
          {fileSizes?.decrypted && (
            <p className="text-sm text-gray-500">
              Tamaño archivo desencriptado: {(fileSizes.decrypted / 1024).toFixed(2)} KB
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleDecrypt}
          disabled={isDecryptDisabled}
          className="flex-1"
        >
          Desencriptar
        </Button>
        
        <Button
          onClick={handleDownloadDecrypted}
          disabled={isDownloadDisabled}
          variant="outline"
          className="flex-1 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Descargar
        </Button>

        <Button
          variant="secondary"
          onClick={handleShare}
          disabled={!decryptedImage}
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
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

      {decryptedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Imagen Desencriptada</h3>
          <img
            src={decryptedImage}
            alt="Imagen desencriptada"
            className="max-h-64 mx-auto object-contain"
          />
        </div>
      )}
    </div>
  );
};
