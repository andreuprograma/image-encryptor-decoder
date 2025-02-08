
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncryptTab } from "@/components/EncryptTab";
import { DecryptTab } from "@/components/DecryptTab";
import { format } from "date-fns";

const Index = () => {
  // This will be "frozen" at build time
  const currentDateTime = format(new Date(), "dd/MM/yyyy HH:mm");

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Encriptador de Imágenes</h1>
        <span className="text-sm text-muted-foreground">v.{currentDateTime}</span>
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
