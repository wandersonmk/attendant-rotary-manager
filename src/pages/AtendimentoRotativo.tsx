import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, User, Coffee, Power } from "lucide-react";
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
  status: "aguardando" | "atendendo" | "pausa" | "encerrado";
  posicao: number;
  vendas?: number;
  valorVendas?: number;
  motivoPausa?: string;
}

const AtendimentoRotativo = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([
    { id: 1, nome: "Carlos Silva", status: "atendendo", posicao: 1, vendas: 0, valorVendas: 0 },
    { id: 2, nome: "Ana Oliveira", status: "aguardando", posicao: 2, vendas: 0, valorVendas: 0 },
    { id: 3, nome: "João Santos", status: "aguardando", posicao: 3, vendas: 0, valorVendas: 0 },
    { id: 4, nome: "Maria Lima", status: "aguardando", posicao: 4, vendas: 0, valorVendas: 0 },
  ]);

  const [showVendaDialog, setShowVendaDialog] = useState(false);
  const [showPausaDialog, setShowPausaDialog] = useState(false);
  const [vendedorFinalizando, setVendedorFinalizando] = useState<number | null>(null);
  const [vendedorPausa, setVendedorPausa] = useState<number | null>(null);
  const [valorVenda, setValorVenda] = useState("");
  const [motivoPausa, setMotivoPausa] = useState<"almoço" | "café" | "">("");

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

  const handleIniciarPausa = (id: number) => {
    setVendedorPausa(id);
    setShowPausaDialog(true);
  };

  const handleConfirmarPausa = () => {
    if (!vendedorPausa || !motivoPausa) return;

    setVendedores((prev) => {
      const vendedorAtual = prev.find((v) => v.id === vendedorPausa);
      if (!vendedorAtual) return prev;

      const posicaoAtual = vendedorAtual.posicao;
      const ultimaPosicao = Math.max(...prev.map((v) => v.posicao));

      return prev.map((vendedor) => {
        if (vendedor.id === vendedorPausa) {
          return {
            ...vendedor,
            status: "pausa",
            posicao: ultimaPosicao + 1,
            motivoPausa,
          };
        } else if (vendedor.posicao > posicaoAtual) {
          return { ...vendedor, posicao: vendedor.posicao - 1 };
        }
        return vendedor;
      });
    });

    toast({
      title: "Pausa iniciada",
      description: `Motivo: ${motivoPausa}`,
    });

    setShowPausaDialog(false);
    setMotivoPausa("");
    setVendedorPausa(null);
  };

  const handleEncerrarExpediente = (id: number) => {
    setVendedores((prev) =>
      prev.map((vendedor) => {
        if (vendedor.id === id) {
          return { ...vendedor, status: "encerrado" };
        }
        return vendedor;
      })
    );

    toast({
      title: "Expediente encerrado",
      description: "Até a próxima!",
    });
  };

  const handleRetornarPausa = (id: number) => {
    setVendedores((prev) =>
      prev.map((vendedor) => {
        if (vendedor.id === id) {
          return { ...vendedor, status: "aguardando", motivoPausa: undefined };
        }
        return vendedor;
      })
    );

    toast({
      title: "Retorno da pausa",
      description: "Bem-vindo de volta!",
    });
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
                    : vendedor.status === "pausa"
                    ? "bg-yellow-50 border-yellow-200"
                    : vendedor.status === "encerrado"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      vendedor.status === "atendendo"
                        ? "bg-green-100 text-green-600"
                        : vendedor.status === "pausa"
                        ? "bg-yellow-100 text-yellow-600"
                        : vendedor.status === "encerrado"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {vendedor.status === "atendendo" ? (
                      <Timer className="w-5 h-5" />
                    ) : vendedor.status === "pausa" ? (
                      <Coffee className="w-5 h-5" />
                    ) : vendedor.status === "encerrado" ? (
                      <Power className="w-5 h-5" />
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
                          : vendedor.status === "pausa"
                          ? "text-yellow-600"
                          : vendedor.status === "encerrado"
                          ? "text-gray-600"
                          : "text-gray-500"
                      }`}
                    >
                      {vendedor.status === "atendendo"
                        ? "Em atendimento"
                        : vendedor.status === "pausa"
                        ? `Em pausa (${vendedor.motivoPausa})`
                        : vendedor.status === "encerrado"
                        ? "Expediente encerrado"
                        : `${vendedor.posicao}º da fila`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {vendedor.status === "atendendo" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleFinalizarAtendimento(vendedor.id)}
                      >
                        Finalizar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleIniciarPausa(vendedor.id)}
                      >
                        Pausar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleEncerrarExpediente(vendedor.id)}
                      >
                        Encerrar
                      </Button>
                    </>
                  )}
                  {vendedor.status === "pausa" && (
                    <Button
                      variant="outline"
                      onClick={() => handleRetornarPausa(vendedor.id)}
                    >
                      Retornar
                    </Button>
                  )}
                  {vendedor.status === "aguardando" &&
                    proximoVendedor?.id === vendedor.id && (
                      <Button
                        variant="default"
                        onClick={() => handleIniciarAtendimento(vendedor.id)}
                      >
                        Iniciar Atendimento
                      </Button>
                    )}
                </div>
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
            <AlertDialogCancel onClick={handleSemVenda}>
              Não houve venda
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarVenda}>
              Confirmar Venda
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showPausaDialog} onOpenChange={setShowPausaDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Iniciar Pausa</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione o motivo da pausa:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 space-y-2">
            <Button
              variant={motivoPausa === "almoço" ? "default" : "outline"}
              className="w-full"
              onClick={() => setMotivoPausa("almoço")}
            >
              Almoço
            </Button>
            <Button
              variant={motivoPausa === "café" ? "default" : "outline"}
              className="w-full"
              onClick={() => setMotivoPausa("café")}
            >
              Café
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPausaDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarPausa}>
              Confirmar Pausa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AtendimentoRotativo;
