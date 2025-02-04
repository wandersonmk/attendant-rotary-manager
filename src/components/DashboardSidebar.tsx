import {
  Home,
  Users,
  BarChart3,
  Settings,
  ShoppingBag,
  HelpCircle,
  MessageSquare,
  LogOut,
  UserCircle,
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
    title: "Vendedores",
    icon: Users,
    url: "/manager/vendedores",
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    url: "/manager/relatorios",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/manager/configuracoes",
  },
]

const secondaryMenuItems = [
  {
    title: "Produtos",
    icon: ShoppingBag,
    url: "/manager/produtos",
  },
  {
    title: "Suporte",
    icon: MessageSquare,
    url: "/manager/suporte",
  },
  {
    title: "FAQ",
    icon: HelpCircle,
    url: "/manager/faq",
  },
]

export function DashboardSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
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
                        ? "bg-[#E5DEFF] text-[#7E69AB]"
                        : "hover:bg-[#E5DEFF] hover:text-[#7E69AB]"
                    }`}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Suporte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    asChild
                    isActive={location.pathname === item.url}
                    className={`w-full rounded-md transition-colors px-3 py-2 ${
                      location.pathname === item.url
                        ? "bg-[#F2FCE2] text-[#10b981]"
                        : "hover:bg-[#F2FCE2] hover:text-[#10b981]"
                    }`}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2 p-4">
          <UserCircle className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">João Silva</span>
            <span className="text-xs text-muted-foreground">Gerente</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              className="w-full rounded-md transition-colors text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2"
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}