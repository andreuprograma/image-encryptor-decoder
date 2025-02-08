
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface SeedWordInputProps {
  seedWord: string;
  onChange: (value: string) => void;
  showSeedWord: boolean;
  onToggleVisibility: () => void;
}

export const SeedWordInput = ({
  seedWord,
  onChange,
  showSeedWord,
  onToggleVisibility,
}: SeedWordInputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="seed-word" className="text-sm font-medium">
        Palabra Semilla
      </label>
      <div className="relative">
        <Input
          id="seed-word"
          type={showSeedWord ? "text" : "password"}
          value={seedWord}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Introduce la palabra semilla"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={onToggleVisibility}
        >
          {showSeedWord ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
