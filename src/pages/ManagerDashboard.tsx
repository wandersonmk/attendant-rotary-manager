import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Timer, Filter } from "lucide-react"
import { VendedorList } from "@/components/VendedorList"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"

const vendasSemanais = [
  { dia: "Segunda", vendas: 4200 },
  { dia: "Terça", vendas: 3800 },
  { dia: "Quarta", vendas: 5100 },
  { dia: "Quinta", vendas: 4700 },
  { dia: "Sexta", vendas: 6200 },
  { dia: "Sábado", vendas: 5400 },
  { dia: "Domingo", vendas: 3500 },
];

const desempenhoVendedores = [
  { nome: "Carlos Silva", vendas: 15200 },
  { nome: "Ana Oliveira", vendas: 13500 },
  { nome: "João Santos", vendas: 9800 },
  { nome: "Maria Lima", vendas: 8500 },
];

const ManagerDashboard = () => {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1">
          <div className="container p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-[#1a365d]">Dashboard Gerente</h1>
                  <p className="text-muted-foreground mt-1">Loja 1 - Visão Geral</p>
                </div>
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Últimos 7 dias
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendedores Ativos</CardTitle>
            <Users className="h-4 w-4 text-[#9b87f5]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground mt-1">+2 desde o último mês</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendas Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#10b981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4.320</div>
            <p className="text-xs text-[#10b981] mt-1">+15% desde ontem</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Atendimento</CardTitle>
            <Timer className="h-4 w-4 text-[#7E69AB]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Tempo médio: 15min</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
            <UserPlus className="h-4 w-4 text-[#1EAEDB]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-[#1EAEDB] mt-1">+5% desde ontem</p>
          </CardContent>
        </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Vendas Semanais</CardTitle>
            <p className="text-sm text-muted-foreground">Desempenho dos últimos 7 dias</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  vendas: {
                    theme: {
                      light: "#9b87f5",
                      dark: "#7E69AB",
                    },
                  },
                }}
              >
                <BarChart data={vendasSemanais}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p className="text-sm">R$ {payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Bar dataKey="vendas" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Desempenho por Vendedor</CardTitle>
            <p className="text-sm text-muted-foreground">Total de vendas por vendedor</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  vendas: {
                    theme: {
                      light: "#10b981",
                      dark: "#059669",
                    },
                  },
                }}
              >
                <BarChart data={desempenhoVendedores} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nome" type="category" width={100} />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p className="text-sm">R$ {payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Bar dataKey="vendas" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Lista de Atendimento</CardTitle>
            <p className="text-sm text-muted-foreground">Status dos vendedores em tempo real</p>
          </CardHeader>
          <CardContent>
            <VendedorList />
          </CardContent>
        </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default ManagerDashboard
