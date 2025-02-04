import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  const handleStatusChange = (id: number) => {
    setVendedores((prev) =>
      prev.map((vendedor) => {
        if (vendedor.id === id) {
          const novoStatus = vendedor.status === "disponível" ? "atendendo" : "disponível";
          return {
            ...vendedor,
            status: novoStatus,
            tempoEspera: novoStatus === "atendendo" ? "0 min" : undefined,
          };
        }
        return vendedor;
      })
    );
  };

  return (
    <div className="space-y-4">
      {vendedores.map((vendedor) => (
        <div
          key={vendedor.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            vendedor.status === "disponível" ? "bg-white" : "bg-muted"
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
          <div className="space-x-2">
            <Button
              variant={vendedor.status === "disponível" ? "secondary" : "outline"}
              onClick={() => handleStatusChange(vendedor.id)}
            >
              {vendedor.status === "disponível" ? "Iniciar Atendimento" : "Finalizar"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};