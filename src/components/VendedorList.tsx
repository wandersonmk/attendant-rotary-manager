import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface Vendedor {
  id: number;
  nome: string;
  status: "disponível" | "atendendo";
  tempoEspera?: string;
}

export const VendedorList = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([
    { id: 1, nome: "Carlos Silva", status: "disponível" },
    { id: 2, nome: "Ana Oliveira", status: "atendendo", tempoEspera: "5 min" },
    { id: 3, nome: "João Santos", status: "disponível" },
    { id: 4, nome: "Maria Lima", status: "disponível" },
    { id: 5, nome: "Pedro Costa", status: "atendendo", tempoEspera: "10 min" },
    { id: 6, nome: "Julia Rocha", status: "disponível" },
  ]);

  const toggleVendedor = (id: number) => {
    setVendedores(vendedores.map(v => 
      v.id === id 
        ? { ...v, status: v.status === "disponível" ? "atendendo" : "disponível", tempoEspera: undefined }
        : v
    ));
  };

  return (
    <div className="space-y-4">
      {vendedores.map((vendedor) => (
        <div
          key={vendedor.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            vendedor.status === "disponível" ? "bg-white dark:bg-gray-800" : "bg-muted"
          }`}
        >
          <div>
            <h3 className="font-medium">{vendedor.nome}</h3>
            <span
              className={`text-sm ${
                vendedor.status === "disponível" ? "text-success" : "text-muted-foreground"
              }`}
            >
              {vendedor.status.charAt(0).toUpperCase() + vendedor.status.slice(1)}
              {vendedor.tempoEspera && ` - ${vendedor.tempoEspera}`}
            </span>
          </div>
          <Button
            variant={vendedor.status === "disponível" ? "destructive" : "default"}
            size="sm"
            onClick={() => toggleVendedor(vendedor.id)}
          >
            {vendedor.status === "disponível" ? (
              <>
                <Minus className="h-4 w-4 mr-1" />
                Remover
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};