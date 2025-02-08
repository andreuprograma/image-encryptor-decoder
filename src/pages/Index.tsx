
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncryptTab } from "@/components/EncryptTab";
import { DecryptTab } from "@/components/DecryptTab";
import { useState, useEffect } from "react";

const Index = () => {
  const [version, setVersion] = useState(1);

  useEffect(() => {
    const handleVersionChange = () => {
      setVersion(prev => prev + 1);
    };

    window.addEventListener('encryptChange', handleVersionChange);
    window.addEventListener('decryptChange', handleVersionChange);

    return () => {
      window.removeEventListener('encryptChange', handleVersionChange);
      window.removeEventListener('decryptChange', handleVersionChange);
    };
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Encriptador de Imágenes</h1>
        <span className="text-sm text-gray-500">v{version}</span>
      </div>
      
      <Tabs defaultValue="encrypt" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="encrypt">Encriptar</TabsTrigger>
          <TabsTrigger value="decrypt">Desencriptar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encrypt" className="m-0">
          <EncryptTab />
        </TabsContent>
        
        <TabsContent value="decrypt" className="m-0">
          <DecryptTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
