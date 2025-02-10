
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncryptTab } from "@/components/EncryptTab";
import { DecryptTab } from "@/components/DecryptTab";

const BUILD_TIMESTAMP = import.meta.env.VITE_BUILD_TIME || "Development";

const Index = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col items-center gap-2 mb-8">
        <img 
          src="/lovable-uploads/a6c7e6eb-754d-4e81-97de-af4799cc0bc8.png" 
          alt="Logo encriptador"
          className="w-24 h-auto mb-2"
        />
        <h1 className="text-3xl font-bold text-center">
          Encriptador de Imágenes{" "}
          <span className="text-sm font-normal text-gray-500">
            (v.{BUILD_TIMESTAMP})
          </span>
        </h1>
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
