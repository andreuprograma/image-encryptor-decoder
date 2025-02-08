import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, Eye, EyeOff, X, Upload } from "lucide-react";
import CryptoJS from "crypto-js";
import { Filesystem, Directory } from '@capacitor/filesystem';

export const DecryptTab = () => {
  const [encFile, setEncFile] = useState<File | null>(null);
  const [seedWord, setSeedWord] = useState("");
  const [showSeedWord, setShowSeedWord] = useState(false);
  const [decryptedImage, setDecryptedImage] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [fileSizes, setFileSizes] = useState<{
    encrypted: number;
    decrypted: number;
  } | null>(null);
  const [lastEncryptedContent, setLastEncryptedContent] = useState<string | null>(null);
  const [lastUsedSeed, setLastUsedSeed] = useState<string>("");

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.enc')) {
      handleFileSelect(file);
    } else {
      toast({
        variant: "destructive",
        description: "Por favor, selecciona un archivo .enc válido",
      });
    }
  };

  const handleFileSelect = (file: File) => {
    setEncFile(file);
    setFileName(`decrypted_${file.name.replace('.enc', '')}`);
    setFileSizes(prev => prev ? { ...prev, encrypted: file.size } : { encrypted: file.size, decrypted: 0 });
    setDecryptedImage("");
    setLastEncryptedContent(null);
    toast({
      description: "Archivo .enc cargado correctamente",
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.enc')) {
      handleFileSelect(file);
    } else if (file) {
      toast({
        variant: "destructive",
        description: "Por favor, selecciona un archivo .enc válido",
      });
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
          
          // Dispatch event for version tracking
          window.dispatchEvent(new CustomEvent('decryptChange'));
          
          toast({
            description: "Imagen desencriptada correctamente ✨",
          });
        } catch (error) {
          setDecryptedImage("");
          toast({
            variant: "destructive",
            description: "Palabra semilla incorrecta o archivo corrupto",
          });
        }
      };

      reader.readAsText(encFile);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error al desencriptar la imagen",
      });
    }
  };

  const handleDownloadDecrypted = async () => {
    if (!decryptedImage) return;
    
    try {
      // Convertir data URL a Blob
      const response = await fetch(decryptedImage);
      const blob = await response.blob();
      
      // Guardar en Downloads
      await Filesystem.writeFile({
        path: `Download/${fileName}`,
        data: await blob.text(),
        directory: Directory.ExternalStorage,
        recursive: true
      });
      
      // Dispatch event for version tracking
      window.dispatchEvent(new CustomEvent('decryptChange'));
      
      toast({
        description: "Imagen guardada en Descargas/Downloads 💾",
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      toast({
        variant: "destructive",
        description: "Error al guardar la imagen",
      });
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
    toast({
      description: "Campos limpiados correctamente",
    });
  };

  const isDecryptDisabled = !encFile || !seedWord || (
    lastEncryptedContent === (encFile ? lastEncryptedContent : null) && lastUsedSeed === seedWord
  );

  return (
    <div className="space-y-6 p-4 border rounded-lg">
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
            <p className="text-green-600 mb-2">
              Archivo seleccionado: {encFile.name}
            </p>
            {fileSizes && (
              <p className="text-sm text-gray-500">
                Tamaño archivo encriptado: {(fileSizes.encrypted / 1024).toFixed(2)} KB
              </p>
            )}
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
          disabled={!decryptedImage}
          variant="outline"
          className="flex-1 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
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
