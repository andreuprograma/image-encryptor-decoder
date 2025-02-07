
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncryptTab } from "@/components/EncryptTab";
import { DecryptTab } from "@/components/DecryptTab";
import { useState } from "react";

const Index = () => {
  const [encryptState, setEncryptState] = useState({
    image: null,
    previewUrl: "",
    seedWord: "",
    rotation: 0,
    encryptedData: null,
    fileName: "",
    lastEncryptedImage: null,
    lastUsedSeed: "",
  });

  const [decryptState, setDecryptState] = useState({
    encFile: null,
    seedWord: "",
    decryptedImage: "",
    fileName: "",
    fileSizes: null,
    lastEncryptedContent: null,
    lastUsedSeed: "",
  });

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Encriptador de Imágenes</h1>
      
      <Tabs defaultValue="encrypt" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="encrypt">Encriptar</TabsTrigger>
          <TabsTrigger value="decrypt">Desencriptar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encrypt" className="m-0">
          <EncryptTab
            state={encryptState}
            setState={setEncryptState}
          />
        </TabsContent>
        
        <TabsContent value="decrypt" className="m-0">
          <DecryptTab
            state={decryptState}
            setState={setDecryptState}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
