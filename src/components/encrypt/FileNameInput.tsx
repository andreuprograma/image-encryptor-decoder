
import React from "react";
import { Input } from "@/components/ui/input";

interface FileNameInputProps {
  fileName: string;
  onChange: (value: string) => void;
  encryptedSize: number;
}

export const FileNameInput = ({
  fileName,
  onChange,
  encryptedSize,
}: FileNameInputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="file-name" className="text-sm font-medium">
        Nombre del archivo encriptado
      </label>
      <Input
        id="file-name"
        type="text"
        value={fileName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="nombre_archivo.enc"
      />
    </div>
  );
};
