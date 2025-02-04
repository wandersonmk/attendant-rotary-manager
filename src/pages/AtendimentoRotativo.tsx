import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { VendedorCard } from "@/components/VendedorCard";
import { VendaDialog } from "@/components/VendaDialog";
import { PausaDialog } from "@/components/PausaDialog";

interface Vendedor {
  id: number;
  nome: string;
  status: "nao_iniciado" | "aguardando" | "atendendo" | "pausa" | "encerrado";
  posicao: number;
  vendas?: number;
  valorVendas?: number;
  motivoPausa?: string;
}

const AtendimentoRotativo = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([
    { id: 1, nome: "Carlos Silva", status: "nao_iniciado", posicao: 0, vendas: 0, valorVendas: 0 },
    { id: 2, nome: "Ana Oliveira", status: "nao_iniciado", posicao: 0, vendas: 0, valorVendas: 0 },
    { id: 3, nome: "João Santos", status: "nao_iniciado", posicao: 0, vendas: 0, valorVendas: 0 },
    { id: 4, nome: "Maria Lima", status: "nao_iniciado", posicao: 0, vendas: 0, valorVendas: 0 },
  ]);

  const [showVendaDialog, setShowVendaDialog] = useState(false);
  const [showPausaDialog, setShowPausaDialog] = useState(false);
  const [vendedorFinalizando, setVendedorFinalizando] = useState<number | null>(null);
  const [vendedorPausa, setVendedorPausa] = useState<number | null>(null);
  const [valorVenda, setValorVenda] = useState("");
  const [motivoPausa, setMotivoPausa] = useState<"almoço" | "café" | "">("");

  const handleIniciarExpediente = (id: number) => {
    setVendedores((prev) => {
      const ultimaPosicao = Math.max(...prev.filter(v => v.status !== "nao_iniciado").map((v) => v.posicao), 0);
      return prev.map((vendedor) => {
        if (vendedor.id === id) {
          return { ...vendedor, status: "aguardando", posicao: ultimaPosicao + 1 };
        }
        return vendedor;
      });
    });

    toast({
      title: "Expediente iniciado",
      description: "Vendedor adicionado à fila de atendimento",
    });
  };

  const handleIniciarAtendimento = (id: number) => {
    setVendedores((prev) =>
      prev.map((vendedor) => {
        if (vendedor.id === id) {
          return { ...vendedor, status: "atendendo" };
        }
        return vendedor;
      })
    );

    toast({
      title: "Atendimento iniciado",
      description: "Bom atendimento!",
    });
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

    setVendedores((prev) =>
      prev.map((vendedor) => {
        if (vendedor.id === vendedorPausa) {
          return {
            ...vendedor,
            status: "pausa",
            posicao: 0,
            motivoPausa: motivoPausa,
          };
        }
        return vendedor;
      })
    );

    toast({
      title: "Pausa iniciada",
      description: `Pausa para ${motivoPausa}`,
    });

    setShowPausaDialog(false);
    setVendedorPausa(null);
    setMotivoPausa("");
  };

  const handleEncerrarExpediente = (id: number) => {
    const vendedor = vendedores.find(v => v.id === id);
    
    setVendedores((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return { ...v, status: "encerrado", posicao: 0 };
        }
        return v;
      })
    );

    toast({
      title: "Expediente encerrado",
      description: "Até a próxima!",
    });
  };

  const handleConfirmarVenda = () => {
    if (!vendedorFinalizando) return;

    setVendedores((prev) => {
      const vendedorAtual = prev.find((v) => v.id === vendedorFinalizando);
      if (!vendedorAtual) return prev;

      const ultimaPosicao = Math.max(...prev.map((v) => v.posicao));

      return prev.map((vendedor) => {
        if (vendedor.id === vendedorFinalizando) {
          const novoStatus = vendedorPausa === vendedorFinalizando ? "pausa" : "aguardando";
          return {
            ...vendedor,
            status: novoStatus,
            posicao: novoStatus === "pausa" ? 0 : ultimaPosicao + 1,
            vendas: (vendedor.vendas || 0) + 1,
            valorVendas: (vendedor.valorVendas || 0) + Number(valorVenda),
            motivoPausa: vendedorPausa === vendedorFinalizando ? motivoPausa : undefined,
          };
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
    setVendedorPausa(null);
    setMotivoPausa("");
  };

  const handleSemVenda = () => {
    if (!vendedorFinalizando) return;

    setVendedores((prev) => {
      const vendedorAtual = prev.find((v) => v.id === vendedorFinalizando);
      const ultimaPosicao = Math.max(...prev.map((v) => v.posicao));

      return prev.map((vendedor) => {
        if (vendedor.id === vendedorFinalizando) {
          const novoStatus = "aguardando";
          return { 
            ...vendedor, 
            status: novoStatus, 
            posicao: ultimaPosicao + 1,
          };
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
    setVendedorPausa(null);
    setMotivoPausa("");
  };

  const handleRetornarPausa = (id: number) => {
    setVendedores((prev) => {
      const ultimaPosicao = Math.max(...prev.map((v) => v.posicao));
      return prev.map((vendedor) => {
        if (vendedor.id === id) {
          return { 
            ...vendedor, 
            status: "aguardando", 
            posicao: ultimaPosicao + 1,
            motivoPausa: undefined 
          };
        }
        return vendedor;
      });
    });

    toast({
      title: "Retorno da pausa",
      description: "Bem-vindo de volta!",
    });
  };

  const proximoVendedor = vendedores
    .filter((v) => v.status === "aguardando")
    .sort((a, b) => a.posicao - b.posicao)[0];

  const vendedoresOrdenados = [...vendedores].sort((a, b) => {
    if (a.status === "nao_iniciado" && b.status !== "nao_iniciado") return 1;
    if (a.status !== "nao_iniciado" && b.status === "nao_iniciado") return -1;
    return a.posicao - b.posicao;
  });

  const getQueuePosition = (vendedor: Vendedor) => {
    if (vendedor.status !== "aguardando") return "";
    
    const vendedoresAguardando = vendedores.filter(v => v.status === "aguardando");
    const posicaoNaFila = vendedoresAguardando
      .sort((a, b) => a.posicao - b.posicao)
      .findIndex(v => v.id === vendedor.id);
    
    return posicaoNaFila >= 0 ? `${posicaoNaFila + 1}º da fila` : "";
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const numberValue = Number(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue);
  };

  const handleValorVendaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setValorVenda(rawValue);
  };

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
              <VendedorCard
                key={vendedor.id}
                vendedor={vendedor}
                isProximo={proximoVendedor?.id === vendedor.id}
                onIniciarExpediente={handleIniciarExpediente}
                onIniciarAtendimento={handleIniciarAtendimento}
                onFinalizarAtendimento={handleFinalizarAtendimento}
                onIniciarPausa={handleIniciarPausa}
                onEncerrarExpediente={handleEncerrarExpediente}
                onRetornarPausa={handleRetornarPausa}
                getQueuePosition={getQueuePosition}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <VendaDialog
        showDialog={showVendaDialog}
        onOpenChange={setShowVendaDialog}
        valorVenda={valorVenda}
        onValorVendaChange={handleValorVendaChange}
        onConfirmarVenda={handleConfirmarVenda}
        onSemVenda={handleSemVenda}
        formatCurrency={formatCurrency}
      />

      <PausaDialog
        showDialog={showPausaDialog}
        onOpenChange={setShowPausaDialog}
        motivoPausa={motivoPausa}
        onMotivoPausaChange={setMotivoPausa}
        onConfirmarPausa={handleConfirmarPausa}
      />
    </div>
  );
};

export default AtendimentoRotativo;
