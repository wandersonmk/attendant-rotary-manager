import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, UserPlus, Timer, Filter } from "lucide-react";
import { VendedorList } from "@/components/VendedorList";

const ManagerDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1a365d]">Dashboard Gerente</h1>
          <p className="text-muted-foreground mt-1">Loja 1 - Visão Geral</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Últimos 7 dias
          </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">Lista de Atendimento</CardTitle>
              <p className="text-sm text-muted-foreground">Status dos vendedores em tempo real</p>
            </div>
            <Button className="bg-[#9b87f5] hover:bg-[#7E69AB]">
              Adicionar Vendedor
            </Button>
          </CardHeader>
          <CardContent>
            <VendedorList />
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Ranking de Vendedores</CardTitle>
            <p className="text-sm text-muted-foreground">Top vendedores do dia</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nome: "Carlos Silva", vendas: "R$ 1.520", variacao: "+12%" },
                { nome: "Ana Oliveira", vendas: "R$ 1.350", variacao: "+8%" },
                { nome: "João Santos", vendas: "R$ 980", variacao: "+5%" },
                { nome: "Maria Lima", vendas: "R$ 850", variacao: "+3%" },
              ].map((vendedor, index) => (
                <div
                  key={vendedor.nome}
                  className="flex items-center justify-between p-3 bg-[#F2FCE2] rounded-lg hover:bg-[#F2FCE2]/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#9b87f5] text-white text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium">{vendedor.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{vendedor.vendas}</span>
                    <span className="text-xs text-[#10b981]">{vendedor.variacao}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;