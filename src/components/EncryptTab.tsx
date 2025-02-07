
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCw, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const EncryptTab = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [seedWord, setSeedWord] = useState("");
  const [rotation, setRotation] = useState(0);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageSelect(file);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, selecciona un archivo de imagen válido.",
      });
    }
  };

  const handleImageSelect = (file: File) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
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
    // Implementaremos la encriptación en el siguiente paso
    toast({
      title: "Próximamente",
      description: "La funcionalidad de encriptación estará disponible pronto.",
    });
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      {/* Zona de arrastrar y soltar */}
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
          </div>
        ) : (
          <p className="text-gray-500">
            Arrastra y suelta una imagen aquí o haz clic para seleccionar
          </p>
        )}
      </div>

      {/* Campo de palabra semilla */}
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

      {/* Botones de acción */}
      <div className="flex gap-4">
        <Button
          onClick={handleEncrypt}
          disabled={!image || !seedWord}
          className="flex-1"
        >
          Encriptar
        </Button>
        <Button
          variant="outline"
          disabled={!image || !seedWord}
          className="flex-1"
        >
          Descargar
        </Button>
      </div>
    </div>
  );
};
