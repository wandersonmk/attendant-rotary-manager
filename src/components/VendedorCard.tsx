import { Button } from "@/components/ui/button";
import { Timer, User, Coffee, Power, Play } from "lucide-react";

interface Vendedor {
  id: number;
  nome: string;
  status: "nao_iniciado" | "aguardando" | "atendendo" | "pausa" | "encerrado";
  posicao: number;
  vendas?: number;
  valorVendas?: number;
  motivoPausa?: string;
}

interface VendedorCardProps {
  vendedor: Vendedor;
  isProximo: boolean;
  onIniciarExpediente: (id: number) => void;
  onIniciarAtendimento: (id: number) => void;
  onFinalizarAtendimento: (id: number) => void;
  onIniciarPausa: (id: number) => void;
  onEncerrarExpediente: (id: number) => void;
  onRetornarPausa: (id: number) => void;
  getQueuePosition: (vendedor: Vendedor) => string;
}

export const VendedorCard = ({
  vendedor,
  isProximo,
  onIniciarExpediente,
  onIniciarAtendimento,
  onFinalizarAtendimento,
  onIniciarPausa,
  onEncerrarExpediente,
  onRetornarPausa,
  getQueuePosition,
}: VendedorCardProps) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border ${
        vendedor.status === "atendendo"
          ? "bg-green-50 border-green-200"
          : vendedor.status === "pausa"
          ? "bg-yellow-50 border-yellow-200"
          : vendedor.status === "encerrado"
          ? "bg-gray-50 border-gray-200"
          : vendedor.status === "nao_iniciado"
          ? "bg-blue-50 border-blue-200"
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
              : vendedor.status === "nao_iniciado"
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {vendedor.status === "atendendo" ? (
            <Timer className="w-5 h-5" />
          ) : vendedor.status === "pausa" ? (
            <Coffee className="w-5 h-5" />
          ) : vendedor.status === "encerrado" ? (
            <Power className="w-5 h-5" />
          ) : vendedor.status === "nao_iniciado" ? (
            <Play className="w-5 h-5" />
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
                : vendedor.status === "nao_iniciado"
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            {vendedor.status === "atendendo"
              ? "Em atendimento"
              : vendedor.status === "pausa"
              ? `Em pausa (${vendedor.motivoPausa})`
              : vendedor.status === "encerrado"
              ? "Expediente encerrado"
              : vendedor.status === "nao_iniciado"
              ? "Não iniciado"
              : getQueuePosition(vendedor)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {(vendedor.status === "nao_iniciado" || vendedor.status === "encerrado") && (
          <Button
            variant="default"
            onClick={() => onIniciarExpediente(vendedor.id)}
          >
            Iniciar Expediente
          </Button>
        )}
        {vendedor.status === "atendendo" && (
          <>
            <Button
              variant="outline"
              onClick={() => onFinalizarAtendimento(vendedor.id)}
            >
              Finalizar
            </Button>
            <Button
              variant="outline"
              onClick={() => onIniciarPausa(vendedor.id)}
            >
              Pausar
            </Button>
            <Button
              variant="outline"
              onClick={() => onEncerrarExpediente(vendedor.id)}
            >
              Encerrar
            </Button>
          </>
        )}
        {vendedor.status === "pausa" && (
          <Button
            variant="outline"
            onClick={() => onRetornarPausa(vendedor.id)}
          >
            Retornar
          </Button>
        )}
        {vendedor.status === "aguardando" && (
          <>
            {isProximo && (
              <Button
                variant="default"
                onClick={() => onIniciarAtendimento(vendedor.id)}
              >
                Iniciar Atendimento
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEncerrarExpediente(vendedor.id)}
            >
              <Power className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};