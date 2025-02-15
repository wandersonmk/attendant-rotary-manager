import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Timer, Search, Bell } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Input } from "@/components/ui/input"
import { VendedorRanking } from "@/components/VendedorRanking"
import { MetricasLoja } from "@/components/MetricasLoja"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

const ManagerDashboard = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      // Get current user and their store
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('loja_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (userData?.loja_id) {
          // Get last 7 days of metrics
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 6); // Last 7 days

          const { data: metricsData } = await supabase
            .from('metricas')
            .select('data, total_vendas')
            .eq('loja_id', userData.loja_id)
            .gte('data', startDate.toISOString().split('T')[0])
            .lte('data', endDate.toISOString().split('T')[0])
            .order('data', { ascending: true });

          if (metricsData) {
            const formattedData = metricsData.map(metric => ({
              dia: new Date(metric.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
              vendas: Number(metric.total_vendas || 0),
              lucro: Number(metric.total_vendas * 0.8 || 0) // Assuming 80% of sales is profit for demonstration
            }));
            setRevenueData(formattedData);
          }
        }
      }
    };

    fetchRevenueData();
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-[#1A1F2C]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bem-vindo ao painel de controle
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
                    JD
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">João Silva</p>
                    <p className="text-gray-500 dark:text-gray-400">Gerente</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Métricas da Loja */}
            <MetricasLoja />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">
                      Análise de Receita
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">7D</Button>
                      <Button variant="outline" size="sm">30D</Button>
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
                      <LineChart data={revenueData}>
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

              {/* Ranking de Vendedores */}
              <VendedorRanking />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default ManagerDashboard