import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LojaRankingProps {
  selectedLoja?: string;
}

interface LojaData {
  id: number;
  nome: string;
  total_vendas: number;
  quantidade_vendas: number;
}

export const LojaRanking = ({ selectedLoja }: LojaRankingProps) => {
  const [lojas, setLojas] = useState<LojaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLojas = async () => {
      try {
        // First, get all stores
        const { data: lojasData, error: lojasError } = await supabase
          .from('lojas')
          .select('id, nome')
          .neq('nome', 'Administrador')
          .order('nome');

        if (lojasError) throw lojasError;

        // Then get sales data
        const { data: vendasData, error: vendasError } = await supabase
          .from('atendimentos')
          .select('loja_id, valor_venda')
          .eq('venda_efetuada', true)
          .not('valor_venda', 'is', null);

        if (vendasError) throw vendasError;

        // Combine the data
        const lojasCompletas = lojasData.map(loja => {
          const vendasLoja = vendasData?.filter(venda => venda.loja_id === loja.id) || [];
          const total_vendas = vendasLoja.reduce((sum, venda) => sum + Number(venda.valor_venda || 0), 0);
          
          return {
            id: loja.id,
            nome: loja.nome,
            total_vendas: total_vendas,
            quantidade_vendas: vendasLoja.length
          };
        });

        // Sort by total sales (even if 0)
        const lojasSorted = lojasCompletas.sort((a, b) => b.total_vendas - a.total_vendas);
        setLojas(lojasSorted);
      } catch (error) {
        console.error('Erro ao carregar dados das lojas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLojas();
  }, [selectedLoja]);

  if (loading) {
    return <div className="flex justify-center p-4">Carregando ranking...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Posição</TableHead>
            <TableHead>Loja</TableHead>
            <TableHead className="text-right">Total em Vendas</TableHead>
            <TableHead className="text-right">Quantidade de Vendas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lojas.map((loja, index) => (
            <TableRow key={loja.id}>
              <TableCell className="font-medium">{index + 1}º</TableCell>
              <TableCell>{loja.nome}</TableCell>
              <TableCell className="text-right">
                {loja.total_vendas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </TableCell>
              <TableCell className="text-right">
                {loja.quantidade_vendas}
              </TableCell>
            </TableRow>
          ))}
          {lojas.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhuma loja encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};