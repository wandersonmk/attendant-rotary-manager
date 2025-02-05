import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export const MetricasLoja = () => {
  const [metrics, setMetrics] = useState({
    totalVendas: 0,
    vendedoresAtivos: 0,
    mediaVenda: 0,
    taxaConversao: 0
  })

  useEffect(() => {
    const fetchStoreMetrics = async () => {
      // Get current user and their store
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('loja_id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (userData?.loja_id) {
          // Get total sales
          const { data: salesData } = await supabase
            .from('metricas')
            .select('total_vendas')
            .eq('loja_id', userData.loja_id)
            .maybeSingle()

          // Get active sellers count
          const { count: activeVendedores } = await supabase
            .from('vendedores')
            .select('*', { count: 'exact', head: true })
            .eq('loja_id', userData.loja_id)
            .eq('ativo', true)

          // Get completed sales for average calculation
          const { data: completedSales } = await supabase
            .from('atendimentos')
            .select('valor_venda')
            .eq('loja_id', userData.loja_id)
            .eq('venda_efetuada', true)
            .not('valor_venda', 'is', null)

          // Calculate average sale value
          const totalSalesValue = completedSales?.reduce((acc, curr) => acc + Number(curr.valor_venda || 0), 0) || 0
          const averageSale = completedSales?.length ? totalSalesValue / completedSales.length : 0

          // Calculate conversion rate
          const { count: totalAtendimentos } = await supabase
            .from('atendimentos')
            .select('*', { count: 'exact', head: true })
            .eq('loja_id', userData.loja_id)

          const { count: successfulSales } = await supabase
            .from('atendimentos')
            .select('*', { count: 'exact', head: true })
            .eq('loja_id', userData.loja_id)
            .eq('venda_efetuada', true)

          const conversionRate = totalAtendimentos ? (successfulSales / totalAtendimentos) * 100 : 0

          setMetrics({
            totalVendas: Number(salesData?.total_vendas || 0),
            vendedoresAtivos: activeVendedores || 0,
            mediaVenda: averageSale,
            taxaConversao: conversionRate
          })
        }
      }
    }

    fetchStoreMetrics()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-primary text-white">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-80">Vendas Totais</p>
              <p className="text-2xl font-bold mt-2">
                R$ {metrics.totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-primary-foreground/20 p-3 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-green-300">+17% vs último mês</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vendedores Ativos</p>
              <p className="text-2xl font-bold mt-2">{metrics.vendedoresAtivos}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500">+2 novos este mês</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Média por Venda</p>
              <p className="text-2xl font-bold mt-2">
                R$ {metrics.mediaVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500">+5% vs último mês</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
              <p className="text-2xl font-bold mt-2">{metrics.taxaConversao.toFixed(0)}%</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500">+12% vs último mês</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}