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
  const handleConfirmarVenda = () => {
    if (Number(valorVenda) <= 0) {
      toast({
        title: "Valor inválido",
        description: `Não é possível confirmar uma venda com valor ${formatCurrency(valorVenda)}`,
        variant: "destructive",
      });
      return;
    }
    onConfirmarVenda();
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Registrar Venda</AlertDialogTitle>
          <AlertDialogDescription>
            Informe o valor da venda realizada
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="text"
            value={formatCurrency(valorVenda)}
            onChange={onValorVendaChange}
            placeholder="R$ 0,00"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onSemVenda}>
            Não houve venda
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmarVenda}>
            Confirmar Venda
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};