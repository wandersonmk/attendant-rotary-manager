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
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

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
  const navigate = useNavigate()
  const { toast } = useToast()
  const [storeName, setStoreName] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('nome, loja_id')
          .eq('user_id', user.id)
          .single()

        if (userData) {
          setUserName(userData.nome)
          
          if (userData.loja_id) {
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
    }

    fetchUserInfo()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      })
      navigate('/')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente.",
      })
    }
  }

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
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </span>
            <span>{userName || "Usuário"}</span>
          </button>
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}