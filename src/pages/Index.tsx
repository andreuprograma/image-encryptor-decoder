
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncryptTab } from "@/components/EncryptTab";
import { DecryptTab } from "@/components/DecryptTab";
import { EncryptProvider } from "@/context/EncryptContext";

const BUILD_TIMESTAMP = import.meta.env.VITE_BUILD_TIME || "Development";

const Index = () => {
  return (
    <EncryptProvider>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Encriptador de Imágenes{" "}
          <span className="text-sm font-normal text-gray-500">
            (v.{BUILD_TIMESTAMP})
          </span>
        </h1>
        
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
    </EncryptProvider>
  );
};

export default Index;
