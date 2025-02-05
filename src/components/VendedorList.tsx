import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Vendedor {
  id: number;
  nome: string;
  ativo: boolean;
  loja_id: number | null;
}

export const VendedorList = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [novoVendedor, setNovoVendedor] = useState("");
  const [filtro, setFiltro] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchVendedores();
  }, []);

  const fetchVendedores = async () => {
    try {
      const { data: vendedoresData, error } = await supabase
        .from('vendedores')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar vendedores:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os vendedores",
          variant: "destructive",
        });
        return;
      }

      setVendedores(vendedoresData || []);
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os vendedores",
        variant: "destructive",
      });
    }
  };

  const adicionarVendedor = async () => {
    if (!novoVendedor.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome do vendedor",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vendedores')
        .insert([
          { nome: novoVendedor.trim() }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setVendedores([...vendedores, data]);
      setNovoVendedor("");
      toast({
        title: "Sucesso",
        description: "Vendedor adicionado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao adicionar vendedor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o vendedor",
        variant: "destructive",
      });
    }
  };

  const removerVendedor = async (id: number) => {
    try {
      const { error } = await supabase
        .from('vendedores')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setVendedores(vendedores.filter(v => v.id !== id));
      toast({
        title: "Sucesso",
        description: "Vendedor removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao remover vendedor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o vendedor",
        variant: "destructive",
      });
    }
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
            vendedor.ativo ? "bg-white dark:bg-gray-800" : "bg-muted"
          }`}
        >
          <div>
            <h3 className="font-medium">{vendedor.nome}</h3>
            <span
              className={`text-sm ${
                vendedor.ativo ? "text-success" : "text-muted-foreground"
              }`}
            >
              {vendedor.ativo ? "Ativo" : "Inativo"}
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