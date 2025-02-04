import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Vendedor {
  id: number;
  nome: string;
  vendas: number;
  valor: number;
}

interface VendedorRankingProps {
  data: Vendedor[];
}

export const VendedorRanking = ({ data }: VendedorRankingProps) => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Ranking de Vendedores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((vendedor, index) => (
            <div
              key={vendedor.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-muted-foreground w-6">
                  #{index + 1}
                </span>
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {vendedor.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{vendedor.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {vendedor.vendas} vendas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  R$ {vendedor.valor.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total em vendas
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}