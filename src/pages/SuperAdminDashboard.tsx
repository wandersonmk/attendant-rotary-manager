import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, TrendingUp, Store } from "lucide-react";

const SuperAdminDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard SuperAdmin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Lojas</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.234</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Loja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Loja 1", "Loja 2", "Loja 3", "Loja 4"].map((loja) => (
                <div key={loja} className="flex items-center justify-between">
                  <span className="font-medium">{loja}</span>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Gerentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full">Adicionar Novo Gerente</Button>
              <div className="space-y-2">
                {["João Silva", "Maria Santos", "Pedro Lima", "Ana Costa"].map((gerente) => (
                  <div key={gerente} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <span>{gerente}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm">
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;