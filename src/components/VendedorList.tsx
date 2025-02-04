import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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

  const [novoVendedor, setNovoVendedor] = useState("");
  const [filtro, setFiltro] = useState("");
  const { toast } = useToast();

  const adicionarVendedor = () => {
    if (!novoVendedor.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome do vendedor",
        variant: "destructive",
      });
      return;
    }

    const novoId = Math.max(...vendedores.map(v => v.id)) + 1;
    setVendedores([
      ...vendedores,
      {
        id: novoId,
        nome: novoVendedor,
        status: "disponível"
      }
    ]);
    setNovoVendedor("");
    toast({
      title: "Sucesso",
      description: "Vendedor adicionado com sucesso",
    });
  };

  const removerVendedor = (id: number) => {
    setVendedores(vendedores.filter(v => v.id !== id));
    toast({
      title: "Sucesso",
      description: "Vendedor removido com sucesso",
    });
  };

  const vendedoresFiltrados = vendedores.filter(vendedor =>
    vendedor.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Nome do novo vendedor"
          value={novoVendedor}
          onChange={(e) => setNovoVendedor(e.target.value)}
          className="flex-1"
        />
        <Button onClick={adicionarVendedor}>
          <UserPlus className="h-4 w-4 mr-1" />
          Adicionar Vendedor
        </Button>
      </div>

      <Input
        placeholder="Filtrar vendedores..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4"
      />

      {vendedoresFiltrados.map((vendedor) => (
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
            variant="destructive"
            size="sm"
            onClick={() => removerVendedor(vendedor.id)}
          >
            <UserMinus className="h-4 w-4 mr-1" />
            Remover
          </Button>
        </div>
      ))}
    </div>
  );
};