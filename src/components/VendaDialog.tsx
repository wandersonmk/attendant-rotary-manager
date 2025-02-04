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

interface VendaDialogProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  valorVenda: string;
  onValorVendaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmarVenda: () => void;
  onSemVenda: () => void;
  formatCurrency: (value: string) => string;
}

export const VendaDialog = ({
  showDialog,
  onOpenChange,
  valorVenda,
  onValorVendaChange,
  onConfirmarVenda,
  onSemVenda,
  formatCurrency,
}: VendaDialogProps) => {
  return (
    <AlertDialog open={showDialog} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finalizar Atendimento</AlertDialogTitle>
          <AlertDialogDescription>
            Houve venda neste atendimento?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Input
            type="text"
            value={valorVenda ? formatCurrency(valorVenda) : "R$ 0,00"}
            onChange={onValorVendaChange}
            className="text-right"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onSemVenda}>
            Não houve venda
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmarVenda}>
            Confirmar Venda
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};