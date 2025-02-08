
import React, { createContext, useContext, useState } from 'react';

interface EncryptContextType {
  seedWord: string;
  setSeedWord: (word: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  encryptedFile: File | null;
  setEncryptedFile: (file: File | null) => void;
  previewUrl: string;
  setPreviewUrl: (url: string) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
}

const EncryptContext = createContext<EncryptContextType | undefined>(undefined);

export function EncryptProvider({ children }: { children: React.ReactNode }) {
  const [seedWord, setSeedWord] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [rotation, setRotation] = useState(0);

  return (
    <EncryptContext.Provider 
      value={{
        seedWord,
        setSeedWord,
        imageFile,
        setImageFile,
        encryptedFile,
        setEncryptedFile,
        previewUrl,
        setPreviewUrl,
        rotation,
        setRotation
      }}
    >
      {children}
    </EncryptContext.Provider>
  );
}

export function useEncrypt() {
  const context = useContext(EncryptContext);
  if (context === undefined) {
    throw new Error('useEncrypt must be used within a EncryptProvider');
  }
  return context;
}
