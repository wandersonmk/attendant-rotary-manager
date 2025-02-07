import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Timer, Search, Bell, Building2, DollarSign } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Input } from "@/components/ui/input"
import { VendedorRanking } from "@/components/VendedorRanking"
import { supabase } from "@/integrations/supabase/client"

const vendasSemanais = [
  { dia: "Jan 5", vendas: 42000, lucro: 38000 },
  { dia: "Jan 6", vendas: 38000, lucro: 42000 },
  { dia: "Jan 7", vendas: 51000, lucro: 48000 },
  { dia: "Jan 8", vendas: 47000, lucro: 52000 },
  { dia: "Jan 9", vendas: 62000, lucro: 58000 },
  { dia: "Jan 10", vendas: 54000, lucro: 51000 },
  { dia: "Jan 11", vendas: 58000, lucro: 54000 },
];

interface LojaRanking {
  id: number;
  nome: string;
  vendas: number;
  valor: number;
}

interface DashboardMetrics {
  totalVendas: number;
  totalLojas: number;
  totalGerentes: number;
  mediaVendas: number;
}

const SuperAdminDashboard = () => {
  const [lojasRanking, setLojasRanking] = useState<LojaRanking[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalVendas: 0,
    totalLojas: 0,
    totalGerentes: 0,
    mediaVendas: 0,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch total sales from all stores
      const { data: salesData } = await supabase
        .from('atendimentos')
        .select('valor_venda')
        .eq('venda_efetuada', true)
        .not('valor_venda', 'is', null)

      // Fetch total number of stores
      const { count: totalLojas } = await supabase
        .from('lojas')
        .select('*', { count: 'exact', head: true })

      // Fetch total number of managers
      const { count: totalGerentes } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'gerente')

      // Calculate total sales and average per store
      const totalVendas = salesData?.reduce((acc, curr) => acc + Number(curr.valor_venda || 0), 0) || 0
      const mediaVendas = totalLojas ? totalVendas / totalLojas : 0

      setMetrics({
        totalVendas,
        totalLojas: totalLojas || 0,
        totalGerentes: totalGerentes || 0,
        mediaVendas,
      })
    }

    const fetchLojasRanking = async () => {
      const { data: lojas } = await supabase
        .from('lojas')
        .select(`
          id,
          nome,
          atendimentos (
            valor_venda,
            venda_efetuada
          )
        `)

      if (lojas) {
        const lojasProcessadas = lojas.map(loja => {
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

        const lojasOrdenadas = lojasProcessadas.sort((a, b) => b.valor - a.valor)
        setLojasRanking(lojasOrdenadas)
      }
    }

    fetchDashboardData()
    fetchLojasRanking()
  }, [])

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-[#1A1F2C]">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Dashboard SuperAdmin
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visão geral de todas as lojas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquisar..."
                  className="pl-10 w-64 bg-white dark:bg-gray-800"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  SA
                </div>
                <div className="text-sm">
                  <p className="font-medium">Super Admin</p>
                  <p className="text-gray-500 dark:text-gray-400">Administrador</p>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-primary text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium opacity-80">Vendas Totais (Rede)</p>
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
                  <span className="text-green-300">+22% vs último mês</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Lojas</p>
                    <p className="text-2xl font-bold mt-2">{metrics.totalLojas}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-green-500">+3 novas este mês</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Gerentes</p>
                    <p className="text-2xl font-bold mt-2">{metrics.totalGerentes}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-green-500">+5 novos este mês</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Média por Loja</p>
                    <p className="text-2xl font-bold mt-2">
                      R$ {metrics.mediaVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-green-500">+15% vs último mês</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    Análise de Receita (Rede)
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">8 Jan</Button>
                    <Button variant="outline" size="sm">8 Feb</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      vendas: {
                        theme: {
                          light: "#4A7BF7",
                          dark: "#4A7BF7",
                        },
                      },
                      lucro: {
                        theme: {
                          light: "#10b981",
                          dark: "#10b981",
                        },
                      },
                    }}
                  >
                    <LineChart data={vendasSemanais}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="vendas" 
                        stroke="#4A7BF7" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lucro" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Ranking de Lojas */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Ranking de Lojas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lojasRanking.map((loja, index) => (
                    <div
                      key={loja.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{loja.nome}</p>
                          <p className="text-sm text-gray-500">{loja.vendas} vendas</p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        R$ {loja.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SuperAdminDashboard