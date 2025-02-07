
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import CryptoJS from "crypto-js";

export const DecryptTab = () => {
  const [encFile, setEncFile] = useState<File | null>(null);
  const [seedWord, setSeedWord] = useState("");
  const [decryptedImage, setDecryptedImage] = useState<string>("");

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.enc')) {
      setEncFile(file);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, selecciona un archivo .enc válido.",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.enc')) {
      setEncFile(file);
    } else if (file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, selecciona un archivo .enc válido.",
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
          // Intentar desencriptar
          const decrypted = CryptoJS.AES.decrypt(encrypted, seedWord).toString(CryptoJS.enc.Utf8);
          
          if (!decrypted) {
            throw new Error("Palabra semilla incorrecta");
          }

          setDecryptedImage(decrypted);
          toast({
            title: "¡Éxito!",
            description: "Imagen desencriptada correctamente",
          });
        } catch (error) {
          setDecryptedImage("");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Palabra semilla incorrecta o archivo corrupto",
          });
        }
      };

      reader.readAsText(encFile);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al desencriptar la imagen",
      });
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      {/* Zona de arrastrar y soltar */}
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
          <p className="text-green-600">
            Archivo seleccionado: {encFile.name}
          </p>
        ) : (
          <p className="text-gray-500">
            Arrastra y suelta un archivo .enc aquí o haz clic para seleccionar
          </p>
        )}
      </div>

      {/* Campo de palabra semilla */}
      <div className="space-y-2">
        <label htmlFor="decrypt-seed-word" className="text-sm font-medium">
          Palabra Semilla
        </label>
        <Input
          id="decrypt-seed-word"
          type="text"
          value={seedWord}
          onChange={(e) => setSeedWord(e.target.value)}
          placeholder="Introduce la palabra semilla"
        />
      </div>

      {/* Botón de desencriptar */}
      <Button
        onClick={handleDecrypt}
        disabled={!encFile || !seedWord}
        className="w-full"
      >
        Desencriptar
      </Button>

      {/* Área de previsualización */}
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
