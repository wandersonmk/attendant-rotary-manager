import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/integrations/supabase/client"

interface Vendedor {
  id: number;
  nome: string;
  vendas: number;
  valor: number;
}

export const VendedorRanking = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([])

  useEffect(() => {
    const fetchVendedoresRanking = async () => {
      // Get current user and their store
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('loja_id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (userData?.loja_id) {
          // Get all active sellers from the store
          const { data: vendedoresData } = await supabase
            .from('vendedores')
            .select(`
              id,
              nome,
              atendimentos!inner (
                valor_venda,
                venda_efetuada
              )
            `)
            .eq('loja_id', userData.loja_id)
            .eq('ativo', true)

          if (vendedoresData) {
            // Calculate total sales and amount for each seller
            const vendedoresProcessados = vendedoresData.map(vendedor => {
              const vendasEfetuadas = vendedor.atendimentos.filter(
                (a: any) => a.venda_efetuada
              ).length
              const valorTotal = vendedor.atendimentos.reduce(
                (acc: number, curr: any) => acc + Number(curr.valor_venda || 0),
                0
              )

              return {
                id: vendedor.id,
                nome: vendedor.nome,
                vendas: vendasEfetuadas,
                valor: valorTotal
              }
            })

            // Sort by total sales value
            const vendedoresOrdenados = vendedoresProcessados.sort(
              (a, b) => b.valor - a.valor
            )

            setVendedores(vendedoresOrdenados)
          }
        }
      }
    }

    fetchVendedoresRanking()
  }, [])

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Ranking de Vendedores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vendedores.map((vendedor, index) => (
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
                  R$ {vendedor.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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