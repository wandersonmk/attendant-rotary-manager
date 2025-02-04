import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const vendedoresRanking = [
  { id: 1, nome: "Carlos Silva", vendas: 45, valor: 15000 },
  { id: 2, nome: "Ana Oliveira", vendas: 38, valor: 12500 },
  { id: 3, nome: "João Santos", vendas: 35, valor: 11800 },
  { id: 4, nome: "Maria Lima", vendas: 32, valor: 10500 },
  { id: 5, nome: "Pedro Costa", vendas: 30, valor: 9800 },
];

export const VendedorRanking = () => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Ranking de Vendedores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vendedoresRanking.map((vendedor, index) => (
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