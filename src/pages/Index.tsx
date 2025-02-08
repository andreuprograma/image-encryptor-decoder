
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncryptTab } from "@/components/EncryptTab";
import { DecryptTab } from "@/components/DecryptTab";

const Index = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-center gap-2 mb-8">
        <h1 className="text-3xl font-bold">Encriptador de Imágenes</h1>
        <span className="px-2 py-1 text-sm bg-gray-100 rounded-full" title="Número de versión">
          v.{Math.floor(Math.random() * 100)}
        </span>
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
