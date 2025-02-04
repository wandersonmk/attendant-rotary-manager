import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, User } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Vendedor {
  id: number;
  nome: string;
  status: "aguardando" | "atendendo";
  posicao: number;
  vendas?: number;
  valorVendas?: number;
}

const AtendimentoRotativo = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([
    { id: 1, nome: "Carlos Silva", status: "atendendo", posicao: 1, vendas: 0, valorVendas: 0 },
    { id: 2, nome: "Ana Oliveira", status: "aguardando", posicao: 2, vendas: 0, valorVendas: 0 },
    { id: 3, nome: "João Santos", status: "aguardando", posicao: 3, vendas: 0, valorVendas: 0 },
    { id: 4, nome: "Maria Lima", status: "aguardando", posicao: 4, vendas: 0, valorVendas: 0 },
  ]);

  const [showVendaDialog, setShowVendaDialog] = useState(false);
  const [vendedorFinalizando, setVendedorFinalizando] = useState<number | null>(null);
  const [valorVenda, setValorVenda] = useState("");

  const handleIniciarAtendimento = (id: number) => {
    setVendedores((prev) =>
      prev.map((vendedor) => {
        if (vendedor.id === id) {
          return { ...vendedor, status: "atendendo" };
        }
        return vendedor;
      })
    );
  };

  const handleFinalizarAtendimento = (id: number) => {
    setVendedorFinalizando(id);
    setShowVendaDialog(true);
  };

  const handleConfirmarVenda = () => {
    if (!vendedorFinalizando) return;

    setVendedores((prev) => {
      const vendedorAtual = prev.find((v) => v.id === vendedorFinalizando);
      if (!vendedorAtual) return prev;

      const posicaoAtual = vendedorAtual.posicao;
      const ultimaPosicao = Math.max(...prev.map((v) => v.posicao));

      return prev.map((vendedor) => {
        if (vendedor.id === vendedorFinalizando) {
          return {
            ...vendedor,
            status: "aguardando",
            posicao: ultimaPosicao + 1,
            vendas: (vendedor.vendas || 0) + 1,
            valorVendas: (vendedor.valorVendas || 0) + Number(valorVenda),
          };
        } else if (vendedor.posicao > posicaoAtual) {
          return { ...vendedor, posicao: vendedor.posicao - 1 };
        }
        return vendedor;
      });
    });

    toast({
      title: "Venda registrada com sucesso!",
      description: `Valor da venda: R$ ${valorVenda}`,
    });

    setShowVendaDialog(false);
    setValorVenda("");
    setVendedorFinalizando(null);
  };

  const handleSemVenda = () => {
    if (!vendedorFinalizando) return;

    setVendedores((prev) => {
      const vendedorAtual = prev.find((v) => v.id === vendedorFinalizando);
      if (!vendedorAtual) return prev;

      const posicaoAtual = vendedorAtual.posicao;
      const ultimaPosicao = Math.max(...prev.map((v) => v.posicao));

      return prev.map((vendedor) => {
        if (vendedor.id === vendedorFinalizando) {
          return { ...vendedor, status: "aguardando", posicao: ultimaPosicao + 1 };
        } else if (vendedor.posicao > posicaoAtual) {
          return { ...vendedor, posicao: vendedor.posicao - 1 };
        }
        return vendedor;
      });
    });

    toast({
      title: "Atendimento finalizado",
      description: "Vendedor movido para o final da fila",
    });

    setShowVendaDialog(false);
    setValorVenda("");
    setVendedorFinalizando(null);
  };

  // Encontra o primeiro vendedor aguardando na fila
  const proximoVendedor = vendedores
    .filter((v) => v.status === "aguardando")
    .sort((a, b) => a.posicao - b.posicao)[0];

  const vendedoresOrdenados = [...vendedores].sort((a, b) => a.posicao - b.posicao);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Atendimento Rotativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendedoresOrdenados.map((vendedor) => (
              <div
                key={vendedor.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  vendedor.status === "atendendo"
                    ? "bg-green-50 border-green-200"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      vendedor.status === "atendendo"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {vendedor.status === "atendendo" ? (
                      <Timer className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{vendedor.nome}</p>
                    <p
                      className={`text-sm ${
                        vendedor.status === "atendendo"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {vendedor.status === "atendendo"
                        ? "Em atendimento"
                        : `${vendedor.posicao}º da fila`}
                    </p>
                  </div>
                </div>
                {vendedor.status === "atendendo" ? (
                  <Button
                    variant="outline"
                    onClick={() => handleFinalizarAtendimento(vendedor.id)}
                  >
                    Finalizar
                  </Button>
                ) : (
                  proximoVendedor?.id === vendedor.id && (
                    <Button
                      variant="default"
                      onClick={() => handleIniciarAtendimento(vendedor.id)}
                    >
                      Iniciar Atendimento
                    </Button>
                  )
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showVendaDialog} onOpenChange={setShowVendaDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Atendimento</AlertDialogTitle>
            <AlertDialogDescription>
              Houve venda neste atendimento?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              type="number"
              placeholder="Valor da venda (R$)"
              value={valorVenda}
              onChange={(e) => setValorVenda(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSemVenda}>Não houve venda</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarVenda}>
              Confirmar Venda
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AtendimentoRotativo;