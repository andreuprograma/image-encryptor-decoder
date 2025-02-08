
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
  encryptedData: { data: string; size: number } | null;
  setEncryptedData: (data: { data: string; size: number } | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  lastEncryptedImage: string | null;
  setLastEncryptedImage: (image: string | null) => void;
  lastUsedSeed: string;
  setLastUsedSeed: (seed: string) => void;
  hasDownloaded: boolean;
  setHasDownloaded: (downloaded: boolean) => void;
  isEncrypted: boolean;
  setIsEncrypted: (encrypted: boolean) => void;
  downloadedFileName: string;
  setDownloadedFileName: (name: string) => void;
}

const EncryptContext = createContext<EncryptContextType | undefined>(undefined);

export function EncryptProvider({ children }: { children: React.ReactNode }) {
  const [seedWord, setSeedWord] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [rotation, setRotation] = useState(0);
  const [encryptedData, setEncryptedData] = useState<{ data: string; size: number } | null>(null);
  const [fileName, setFileName] = useState("");
  const [lastEncryptedImage, setLastEncryptedImage] = useState<string | null>(null);
  const [lastUsedSeed, setLastUsedSeed] = useState<string>("");
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState("");

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

