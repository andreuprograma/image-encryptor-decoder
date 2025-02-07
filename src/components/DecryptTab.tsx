
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, Eye, EyeOff, X, Upload } from "lucide-react";
import CryptoJS from "crypto-js";
import { useIsMobile } from "@/hooks/use-mobile";

export const DecryptTab = ({ state, setState }) => {
  const [showSeedWord, setShowSeedWord] = useState(false);
  const isMobile = useIsMobile();

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
    setState(prev => ({
      ...prev,
      encFile: file,
      fileName: `decrypted_${file.name.replace('.enc', '')}`,
      fileSizes: prev.fileSizes ? { ...prev.fileSizes, encrypted: file.size } : { encrypted: file.size, decrypted: 0 },
      decryptedImage: "",
      lastEncryptedContent: null,
    }));
    toast({
      description: "Archivo .enc cargado correctamente",
    });
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleClick = () => {
    if (isMobile) {
      // En móviles, intentamos abrir el selector de archivos en la carpeta de descargas
      const input = document.getElementById("enc-file-input") as HTMLInputElement;
      if (input) {
        input.setAttribute("webkitdirectory", "");
        input.setAttribute("directory", "");
        input.click();
      }
    } else {
      document.getElementById("enc-file-input")?.click();
    }
  };

  const handleDecrypt = async () => {
    if (!state.encFile || !state.seedWord) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const encrypted = e.target?.result as string;
        
        try {
          const decrypted = CryptoJS.AES.decrypt(encrypted, state.seedWord).toString(CryptoJS.enc.Utf8);
          
          if (!decrypted) {
            throw new Error("Palabra semilla incorrecta");
          }

          setState(prev => ({
            ...prev,
            decryptedImage: decrypted,
            fileSizes: prev.fileSizes ? 
              { ...prev.fileSizes, decrypted: new Blob([decrypted]).size } : 
              { encrypted: state.encFile.size, decrypted: new Blob([decrypted]).size },
            lastEncryptedContent: encrypted,
            lastUsedSeed: state.seedWord
          }));
          
          toast({
            description: "Imagen desencriptada correctamente ✨",
          });
        } catch (error) {
          setState(prev => ({ ...prev, decryptedImage: "" }));
          toast({
            variant: "destructive",
            description: "Palabra semilla incorrecta o archivo corrupto",
          });
        }
      };

      reader.readAsText(state.encFile);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error al desencriptar la imagen",
      });
    }
  };

  const handleDownloadDecrypted = () => {
    if (!state.decryptedImage) return;

    const link = document.createElement('a');
    link.href = state.decryptedImage;
    link.download = state.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      description: "Imagen descargada correctamente 💾",
    });
  };

  const handleClear = () => {
    setState({
      encFile: null,
      seedWord: "",
      decryptedImage: "",
      fileName: "",
      fileSizes: null,
      lastEncryptedContent: null,
      lastUsedSeed: "",
    });
    toast({
      description: "Campos limpiados correctamente",
    });
  };

  const clearSeedWord = () => {
    setState(prev => ({
      ...prev,
      seedWord: "",
      lastUsedSeed: ""
    }));
  };

  const isDecryptDisabled = !state.encFile || !state.seedWord || (
    state.lastEncryptedContent === (state.encFile ? state.lastEncryptedContent : null) && 
    state.lastUsedSeed === state.seedWord
  );

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleClick}
      >
        <input
          type="file"
          id="enc-file-input"
          className="hidden"
          accept=".enc"
          onChange={handleFileInput}
        />
        {state.encFile ? (
          <div>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-green-600 mb-2">
              Archivo seleccionado: {state.encFile.name}
            </p>
            {state.fileSizes && (
              <p className="text-sm text-gray-500">
                Tamaño archivo encriptado: {(state.fileSizes.encrypted / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="text-gray-500">
              Arrastra y suelta un archivo .enc aquí o haz clic para seleccionar
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
            value={state.seedWord}
            onChange={(e) => setState(prev => ({ ...prev, seedWord: e.target.value }))}
            placeholder="Introduce la palabra semilla"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowSeedWord(!showSeedWord)}
            >
              {showSeedWord ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            {state.seedWord && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSeedWord}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {state.decryptedImage && (
        <div className="space-y-2">
          <label htmlFor="decrypted-file-name" className="text-sm font-medium">
            Nombre del archivo descargado
          </label>
          <Input
            id="decrypted-file-name"
            type="text"
            value={state.fileName}
            onChange={(e) => setState(prev => ({ ...prev, fileName: e.target.value }))}
            placeholder="nombre_archivo"
          />
          {state.fileSizes?.decrypted && (
            <p className="text-sm text-gray-500">
              Tamaño archivo desencriptado: {(state.fileSizes.decrypted / 1024).toFixed(2)} KB
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
          disabled={!state.decryptedImage}
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

      {state.decryptedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Imagen Desencriptada</h3>
          <img
            src={state.decryptedImage}
            alt="Imagen desencriptada"
            className="max-h-64 mx-auto object-contain"
          />
        </div>
      )}
    </div>
  );
};
