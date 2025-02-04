import {
  Users,
  Settings,
  LogOut,
  FileText,
  Filter,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"

const primaryMenuItems = [
  {
    title: "Vendedores",
    icon: Users,
    url: "/manager/vendedores",
  },
  {
    title: "Filtros",
    icon: Filter,
    url: "/manager/filtros",
  },
  {
    title: "Relatórios",
    icon: FileText,
    url: "/manager/relatorios",
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
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
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