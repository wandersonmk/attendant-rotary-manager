import { DashboardSidebar } from "@/components/DashboardSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VendedorList } from "@/components/VendedorList"

const Vendedores = () => {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-[#1A1F2C]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Vendedores
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie sua equipe de vendas
              </p>
            </div>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Lista de Vendedores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VendedorList />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Vendedores