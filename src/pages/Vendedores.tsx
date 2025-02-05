import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { supabase } from "@/integrations/supabase/client"

interface Loja {
  id: number
  nome: string
}

interface Vendedor {
  id: number
  nome: string
  loja_id: number
  loja_nome: string
  total_vendas: number
  valor_total: number
}

const Vendedores = () => {
  const [lojas, setLojas] = useState<Loja[]>([])
  const [selectedLoja, setSelectedLoja] = useState<string>("all")
  const [vendedores, setVendedores] = useState<Vendedor[]>([])

  useEffect(() => {
    const fetchLojas = async () => {
      const { data } = await supabase.from("lojas").select("*")
      if (data) {
        setLojas(data)
      }
    }

    const fetchVendedores = async () => {
      const { data: vendedoresData } = await supabase
        .from("vendedores")
        .select(`
          id,
          nome,
          loja_id,
          lojas (
            nome
          ),
          atendimentos (
            valor_venda,
            venda_efetuada
          )
        `)

      if (vendedoresData) {
        const processedVendedores = vendedoresData.map((vendedor) => {
          const totalVendas = vendedor.atendimentos.filter(
            (a: any) => a.venda_efetuada
          ).length
          const valorTotal = vendedor.atendimentos.reduce(
            (acc: number, curr: any) => acc + Number(curr.valor_venda || 0),
            0
          )

          return {
            id: vendedor.id,
            nome: vendedor.nome,
            loja_id: vendedor.loja_id,
            loja_nome: vendedor.lojas?.nome || "Sem loja",
            total_vendas: totalVendas,
            valor_total: valorTotal,
          }
        })

        setVendedores(processedVendedores)
      }
    }

    fetchLojas()
    fetchVendedores()
  }, [])

  const filteredVendedores = selectedLoja === "all" 
    ? vendedores 
    : vendedores.filter(v => v.loja_id === Number(selectedLoja))

  const rankedVendedores = [...vendedores].sort((a, b) => b.valor_total - a.valor_total)

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
                Gerencie e acompanhe o desempenho dos vendedores
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">
                      Vendedores por Loja
                    </CardTitle>
                    <Select
                      value={selectedLoja}
                      onValueChange={setSelectedLoja}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione uma loja" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem value="all">Todas as lojas</SelectItem>
                        {lojas.map((loja) => (
                          <SelectItem key={loja.id} value={loja.id.toString()}>
                            {loja.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Loja</TableHead>
                        <TableHead className="text-right">Vendas</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendedores.map((vendedor) => (
                        <TableRow key={vendedor.id}>
                          <TableCell>{vendedor.nome}</TableCell>
                          <TableCell>{vendedor.loja_nome}</TableCell>
                          <TableCell className="text-right">
                            {vendedor.total_vendas}
                          </TableCell>
                          <TableCell className="text-right">
                            R$ {vendedor.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Ranking de Vendedores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Posição</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Loja</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rankedVendedores.map((vendedor, index) => (
                        <TableRow key={vendedor.id}>
                          <TableCell>#{index + 1}</TableCell>
                          <TableCell>{vendedor.nome}</TableCell>
                          <TableCell>{vendedor.loja_nome}</TableCell>
                          <TableCell className="text-right">
                            R$ {vendedor.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Vendedores