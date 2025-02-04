import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, User } from "lucide-react";
import { useState } from "react";

interface Vendedor {
  id: number;
  nome: string;
  status: "aguardando" | "atendendo";
  posicao: number;
}

const AtendimentoRotativo = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([
    { id: 1, nome: "Carlos Silva", status: "aguardando", posicao: 1 },
    { id: 2, nome: "Ana Oliveira", status: "atendendo", posicao: 2 },
    { id: 3, nome: "João Santos", status: "aguardando", posicao: 3 },
    { id: 4, nome: "Maria Lima", status: "aguardando", posicao: 4 },
  ]);

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
    setVendedores((prev) => {
      // Encontra o vendedor atual
      const vendedorAtual = prev.find((v) => v.id === id);
      if (!vendedorAtual) return prev;

      // Move o vendedor para o final da fila
      const posicaoAtual = vendedorAtual.posicao;
      const ultimaPosicao = Math.max(...prev.map((v) => v.posicao));

      return prev.map((vendedor) => {
        if (vendedor.id === id) {
          // O vendedor que finalizou vai para o final
          return { ...vendedor, status: "aguardando", posicao: ultimaPosicao + 1 };
        } else if (vendedor.posicao > posicaoAtual) {
          // Ajusta as posições dos outros vendedores
          return { ...vendedor, posicao: vendedor.posicao - 1 };
        }
        return vendedor;
      });
    });
  };

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
                {vendedor.status === "aguardando" && vendedor.posicao === 1 && (
                  <Button
                    onClick={() => handleIniciarAtendimento(vendedor.id)}
                    variant="default"
                  >
                    Iniciar Atendimento
                  </Button>
                )}
                {vendedor.status === "atendendo" && (
                  <Button
                    onClick={() => handleFinalizarAtendimento(vendedor.id)}
                    variant="outline"
                  >
                    Finalizar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AtendimentoRotativo;