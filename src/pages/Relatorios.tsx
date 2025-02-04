import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, FileText } from "lucide-react"
import { VendedorRanking } from "@/components/VendedorRanking"
import { MetricasLoja } from "@/components/MetricasLoja"
import { toast } from "@/components/ui/use-toast"
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

const vendedoresRanking = [
  { id: 1, nome: "Carlos Silva", vendas: 45, valor: 15000 },
  { id: 2, nome: "Ana Oliveira", vendas: 38, valor: 12500 },
  { id: 3, nome: "João Santos", vendas: 35, valor: 11800 },
  { id: 4, nome: "Maria Lima", vendas: 32, valor: 10500 },
  { id: 5, nome: "Pedro Costa", vendas: 30, valor: 9800 },
];

const metricas = {
  vendasTotais: 45231.89,
  vendedoresAtivos: 12,
  mediaVenda: 850.00,
  taxaConversao: 68,
}

const Relatorios = () => {
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
    vendedoresRanking.forEach((vendedor, index) => {
      doc.text(
        `${index + 1}. ${vendedor.nome} - ${vendedor.vendas} vendas - R$ ${vendedor.valor.toLocaleString()}`,
        20,
        120 + (index * 10)
      )
    })
    
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
    
    // Ranking
    const rankingData = [
      ["Posição", "Nome", "Vendas", "Valor Total"],
      ...vendedoresRanking.map((v, i) => [
        i + 1,
        v.nome,
        v.vendas,
        `R$ ${v.valor.toLocaleString()}`,
      ]),
    ]
    
    const rankingSheet = XLSX.utils.aoa_to_sheet(rankingData)
    XLSX.utils.book_append_sheet(workbook, rankingSheet, "Ranking")
    
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
              <div className="flex gap-4">
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