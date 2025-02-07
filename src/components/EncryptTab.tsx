import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCw, RotateCcw, Eye, EyeOff, X, Upload, Camera, Folder } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CryptoJS from "crypto-js";
import { useIsMobile } from "@/hooks/use-mobile";
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const EncryptTab = ({ state, setState }) => {
  const [showSeedWord, setShowSeedWord] = useState(false);
  const isMobile = useIsMobile();

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
    setState(prev => ({
      ...prev,
      image: file,
      previewUrl: URL.createObjectURL(file),
      fileName: `${file.name}.enc`,
      encryptedData: null,
      lastEncryptedImage: null
    }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleMobileCamera = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      if (image.base64String) {
        const response = await fetch(`data:image/jpeg;base64,${image.base64String}`);
        const blob = await response.blob();
        const file = new File([blob], "camera_photo.jpg", { type: 'image/jpeg' });
        handleImageSelect(file);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error al acceder a la cámara",
      });
    }
  };

  const handleMobileFileSelect = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      if (image.base64String) {
        const response = await fetch(`data:image/jpeg;base64,${image.base64String}`);
        const blob = await response.blob();
        const file = new File([blob], "selected_photo.jpg", { type: 'image/jpeg' });
        handleImageSelect(file);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error al seleccionar el archivo",
      });
    }
  };

  const rotate = (direction: "left" | "right") => {
    setState(prev => ({
      ...prev,
      rotation: direction === "right" ? prev.rotation + 90 : prev.rotation - 90
    }));
  };

  const handleEncrypt = async () => {
    if (!state.image || !state.seedWord) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const encrypted = CryptoJS.AES.encrypt(base64, state.seedWord).toString();
        const encryptedSize = new Blob([encrypted]).size;
        
        setState(prev => ({
          ...prev,
          encryptedData: {
            data: encrypted,
            size: encryptedSize
          },
          lastEncryptedImage: base64,
          lastUsedSeed: state.seedWord
        }));

        toast({
          description: "Imagen encriptada correctamente ✨",
        });
      };

      reader.readAsDataURL(state.image);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error al encriptar la imagen",
      });
    }
  };

  const handleDownload = () => {
    if (!state.encryptedData) return;
    
    const blob = new Blob([state.encryptedData.data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = state.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      description: "Archivo encriptado descargado correctamente 💾",
    });
  };

  const handleClear = () => {
    setState({
      image: null,
      previewUrl: "",
      seedWord: "",
      rotation: 0,
      encryptedData: null,
      fileName: "",
      lastEncryptedImage: null,
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

  const isEncryptDisabled = !state.image || !state.seedWord || (
    state.lastEncryptedImage === state.previewUrl && state.lastUsedSeed === state.seedWord
  );

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      {isMobile ? (
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleMobileFileSelect}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Folder className="h-4 w-4" />
            Seleccionar desde galería
          </Button>
          <Button
            onClick={handleMobileCamera}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Camera className="h-4 w-4" />
            Tomar foto
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleImageDrop}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
          />
          {state.previewUrl ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full max-w-md">
                <img
                  src={state.previewUrl}
                  alt="Preview"
                  className="max-h-64 object-contain transition-transform duration-300 mx-auto"
                  style={{ transform: `rotate(${state.rotation}deg)` }}
                />
                <div className="absolute top-0 left-0 right-0 flex justify-center gap-2 mt-2">
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
              {state.image && (
                <p className="text-sm text-gray-500">
                  Tamaño original: {(state.image.size / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="text-gray-500">
                Arrastra y suelta una imagen aquí o haz clic para seleccionar
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="seed-word" className="text-sm font-medium">
          Palabra Semilla
        </label>
        <div className="relative">
          <Input
            id="seed-word"
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

      {state.encryptedData && (
        <div className="space-y-2">
          <label htmlFor="file-name" className="text-sm font-medium">
            Nombre del archivo encriptado
          </label>
          <Input
            id="file-name"
            type="text"
            value={state.fileName}
            onChange={(e) => setState(prev => ({ ...prev, fileName: e.target.value }))}
            placeholder="nombre_archivo.enc"
          />
          <p className="text-sm text-gray-500">
            Tamaño encriptado: {(state.encryptedData.size / 1024).toFixed(2)} KB
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
          disabled={!state.encryptedData}
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
