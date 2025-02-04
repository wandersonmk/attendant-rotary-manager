import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"

const Relatorios = () => {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-[#1A1F2C]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Relatórios
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Página de relatórios em construção
            </p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Relatorios