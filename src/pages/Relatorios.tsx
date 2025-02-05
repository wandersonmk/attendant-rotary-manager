import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, FileText, ChevronDown } from "lucide-react"
import { VendedorRanking } from "@/components/VendedorRanking"
import { MetricasLoja } from "@/components/MetricasLoja"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { useState } from "react"

const Relatorios = () => {
  const [selectedVendedor, setSelectedVendedor] = useState<string>("Todos");

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(20)
    doc.text("Relatório de Vendas", 20, 20)
    
    // Métricas
    doc.setFontSize(14)
    doc.text("Métricas Gerais", 20, 40)
    doc.setFontSize(12)
    doc.text(`Vendas Totais: R$ ${metricas.vendasTotais.toLocaleString()}`, 20, 50)
    doc.text(`Vendedores Ativos: ${metricas.vendedoresAtivos}`, 20, 60)
    doc.text(`Média por Venda: R$ ${metricas.mediaVenda.toLocaleString()}`, 20, 70)
    doc.text(`Taxa de Conversão: ${metricas.taxaConversao}%`, 20, 80)
    
    // Ranking
    doc.setFontSize(14)
    doc.text("Ranking de Vendedores", 20, 100)
    doc.setFontSize(12)
    
    doc.save("relatorio-vendas.pdf")
    toast({
      title: "PDF exportado com sucesso!",
      description: "O relatório foi salvo como 'relatorio-vendas.pdf'",
    })
  }

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new()
    
    // Métricas
    const metricasData = [
      ["Métricas Gerais"],
      ["Vendas Totais", `R$ ${metricas.vendasTotais.toLocaleString()}`],
      ["Vendedores Ativos", metricas.vendedoresAtivos],
      ["Média por Venda", `R$ ${metricas.mediaVenda.toLocaleString()}`],
      ["Taxa de Conversão", `${metricas.taxaConversao}%`],
    ]
    
    const metricasSheet = XLSX.utils.aoa_to_sheet(metricasData)
    XLSX.utils.book_append_sheet(workbook, metricasSheet, "Métricas")
    
    XLSX.writeFile(workbook, "relatorio-vendas.xlsx")
    toast({
      title: "Excel exportado com sucesso!",
      description: "O relatório foi salvo como 'relatorio-vendas.xlsx'",
    })
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-[#1A1F2C]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Relatórios
              </h1>
              <div className="flex gap-4 items-center">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Filtrar por Vendedor:
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        {selectedVendedor}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-800 border shadow-lg">
                      <DropdownMenuItem onClick={() => setSelectedVendedor("Todos")}>
                        Todos
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={exportToPDF}
                >
                  <FileText className="h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={exportToExcel}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar Excel
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas da Loja</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricasLoja />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ranking de Vendedores</CardTitle>
                </CardHeader>
                <CardContent>
                  <VendedorRanking />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Relatorios