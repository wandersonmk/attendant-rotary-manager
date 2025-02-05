import {
  LayoutDashboard,
  Users,
  Store,
  FileText,
  Settings,
  LogOut,
  Building2,
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
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

const primaryMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/super-admin",
  },
  {
    title: "Gerentes",
    icon: Building2,
    url: "/super-admin/gerentes",
  },
  {
    title: "Lojas",
    icon: Store,
    url: "/super-admin/lojas",
  },
  {
    title: "Relatórios",
    icon: FileText,
    url: "/super-admin/relatorios",
  },
  {
    title: "Vendedores",
    icon: Users,
    url: "/super-admin/vendedores",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/super-admin/configuracoes",
  },
]

export function DashboardSidebar() {
  const location = useLocation()
  const [storeName, setStoreName] = useState("")

  useEffect(() => {
    const fetchStoreInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('loja_id')
          .eq('user_id', user.id)
          .single()

        if (userData?.loja_id) {
          const { data: storeData } = await supabase
            .from('lojas')
            .select('nome')
            .eq('id', userData.loja_id)
            .single()

          if (storeData) {
            setStoreName(storeData.nome)
          }
        }
      }
    }

    fetchStoreInfo()
  }, [])

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <h2 className="text-xl font-bold text-primary">{storeName}</h2>
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