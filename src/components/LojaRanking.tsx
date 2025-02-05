import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/integrations/supabase/client"

interface Loja {
  id: number;
  nome: string;
  vendas: number;
  valor: number;
}

export const LojaRanking = () => {
  const [lojas, setLojas] = useState<Loja[]>([])

  useEffect(() => {
    const fetchLojasRanking = async () => {
      // Get all stores and their sales data
      const { data: lojasData } = await supabase
        .from('lojas')
        .select(`
          id,
          nome,
          atendimentos!inner (
            valor_venda,
            venda_efetuada
          )
        `)

      if (lojasData) {
        // Calculate total sales and amount for each store
        const lojasProcessadas = lojasData.map(loja => {
          const vendasEfetuadas = loja.atendimentos.filter(
            (a: any) => a.venda_efetuada
          ).length
          const valorTotal = loja.atendimentos.reduce(
            (acc: number, curr: any) => acc + Number(curr.valor_venda || 0),
            0
          )

          return {
            id: loja.id,
            nome: loja.nome,
            vendas: vendasEfetuadas,
            valor: valorTotal
          }
        })

        // Sort by total sales value
        const lojasOrdenadas = lojasProcessadas.sort(
          (a, b) => b.valor - a.valor
        )

        setLojas(lojasOrdenadas)
      }
    }

    fetchLojasRanking()
  }, [])

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Ranking de Lojas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lojas.map((loja, index) => (
            <div
              key={loja.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-muted-foreground w-6">
                  #{index + 1}
                </span>
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {loja.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{loja.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {loja.vendas} vendas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  R$ {loja.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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