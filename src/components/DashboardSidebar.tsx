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

const primaryMenuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/manager",
  },
  {
    title: "Vendedores",
    icon: Users,
    url: "#vendedores",
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    url: "#relatorios",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "#configuracoes",
  },
]

const secondaryMenuItems = [
  {
    title: "Produtos",
    icon: ShoppingBag,
    url: "#produtos",
  },
  {
    title: "Suporte",
    icon: MessageSquare,
    url: "#suporte",
  },
  {
    title: "FAQ",
    icon: HelpCircle,
    url: "#faq",
  },
]

export function DashboardSidebar() {
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
                    isActive={item.url === "/manager"}
                    className="w-full rounded-md transition-colors hover:bg-[#E5DEFF] hover:text-[#7E69AB] px-3 py-2"
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
                    className="w-full rounded-md transition-colors hover:bg-[#F2FCE2] hover:text-[#10b981] px-3 py-2"
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