import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react"

export const MetricasLoja = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-primary text-white">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-80">Vendas Totais</p>
              <p className="text-2xl font-bold mt-2">R$ 45.231,89</p>
            </div>
            <div className="bg-primary-foreground/20 p-3 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-green-300">+17% vs último mês</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vendedores Ativos</p>
              <p className="text-2xl font-bold mt-2">12</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500">+2 novos este mês</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Média por Venda</p>
              <p className="text-2xl font-bold mt-2">R$ 850,00</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500">+5% vs último mês</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
              <p className="text-2xl font-bold mt-2">68%</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500">+12% vs último mês</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}