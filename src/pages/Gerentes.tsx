import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2 } from "lucide-react"
import { DashboardSidebar } from "@/components/DashboardSidebar"

const managers = [
  { id: 1, name: "João Silva", email: "joao.silva@email.com", store: "Loja Centro", status: "Ativo" },
  { id: 2, name: "Maria Santos", email: "maria.santos@email.com", store: "Loja Shopping", status: "Ativo" },
  { id: 3, name: "Pedro Costa", email: "pedro.costa@email.com", store: "Loja Norte", status: "Inativo" },
  { id: 4, name: "Ana Oliveira", email: "ana.oliveira@email.com", store: "Loja Sul", status: "Ativo" },
  { id: 5, name: "Carlos Lima", email: "carlos.lima@email.com", store: "Loja Oeste", status: "Ativo" },
];

const Gerentes = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-[#1A1F2C]">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Gerentes
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie os gerentes de todas as lojas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar gerente..."
                  className="pl-10 w-64 bg-white dark:bg-gray-800"
                />
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Gerente
              </Button>
            </div>
          </div>

          {/* Lista de Gerentes */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Gerentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg font-medium">
                  <div>Nome</div>
                  <div>Email</div>
                  <div>Loja</div>
                  <div>Status</div>
                  <div>Ações</div>
                </div>
                {managers.map((manager) => (
                  <div key={manager.id} className="grid grid-cols-5 gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg items-center">
                    <div>{manager.name}</div>
                    <div className="text-gray-600 dark:text-gray-300">{manager.email}</div>
                    <div>{manager.store}</div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        manager.status === "Ativo" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {manager.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Gerentes;