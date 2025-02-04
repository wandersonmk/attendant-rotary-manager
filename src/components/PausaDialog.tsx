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
import { Button } from "@/components/ui/button";

interface PausaDialogProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  motivoPausa: "almoço" | "café" | "";
  onMotivoPausaChange: (motivo: "almoço" | "café") => void;
  onConfirmarPausa: () => void;
}

export const PausaDialog = ({
  showDialog,
  onOpenChange,
  motivoPausa,
  onMotivoPausaChange,
  onConfirmarPausa,
}: PausaDialogProps) => {
  return (
    <AlertDialog open={showDialog} onOpenChange={onOpenChange}>
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
            onClick={() => onMotivoPausaChange("almoço")}
          >
            Almoço
          </Button>
          <Button
            variant={motivoPausa === "café" ? "default" : "outline"}
            className="w-full"
            onClick={() => onMotivoPausaChange("café")}
          >
            Café
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmarPausa}>
            Confirmar Pausa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};