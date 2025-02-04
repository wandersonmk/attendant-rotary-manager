import {
  Home,
  Users,
  BarChart3,
  Settings,
  ShoppingBag,
  LogOut,
  FileText,
  Mail,
  History,
  Receipt,
  Wallet,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"

const primaryMenuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/manager",
  },
  {
    title: "Serviços",
    icon: ShoppingBag,
    url: "/manager/servicos",
  },
  {
    title: "Equipe",
    icon: Users,
    url: "/manager/equipe",
  },
  {
    title: "Relatórios",
    icon: FileText,
    url: "/manager/relatorios",
    badge: "4",
  },
  {
    title: "Minhas Tarefas",
    icon: BarChart3,
    url: "/manager/tarefas",
    badge: "1",
  },
  {
    title: "Mensagens",
    icon: Mail,
    url: "/manager/mensagens",
  },
  {
    title: "Transações",
    icon: Wallet,
    url: "/manager/transacoes",
  },
  {
    title: "Faturas",
    icon: Receipt,
    url: "/manager/faturas",
    badge: "2",
  },
  {
    title: "Histórico",
    icon: History,
    url: "/manager/historico",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/manager/configuracoes",
  },
]

export function DashboardSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <img 
            src="/lovable-uploads/77ac6086-d65e-4a8a-bb37-988e5f194efc.png" 
            alt="Logo" 
            className="h-8 w-auto"
          />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={location.pathname === item.url}
                    className={`w-full rounded-md transition-colors px-3 py-2 ${
                      location.pathname === item.url
                        ? "bg-primary text-white"
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <a href={item.url} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 text-sm font-medium">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              JS
            </span>
            <span>João Silva</span>
          </button>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}