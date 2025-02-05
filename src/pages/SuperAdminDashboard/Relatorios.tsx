import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, FileText, ChevronDown } from "lucide-react"
import { LojaRanking } from "@/components/LojaRanking"
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
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

interface MetricasData {
  vendasTotais: number;
  vendedoresAtivos: number;
  mediaVenda: number;
  taxaConversao: number;
}

const Relatorios = () => {
  const [selectedLoja, setSelectedLoja] = useState<string>("Todas");
  const [lojas, setLojas] = useState<{ id: number; nome: string; }[]>([]);
  const [metricas, setMetricas] = useState<MetricasData>({
    vendasTotais: 0,
    vendedoresAtivos: 0,
    mediaVenda: 0,
    taxaConversao: 0
  });

  useEffect(() => {
    const fetchLojas = async () => {
      const { data } = await supabase
        .from('lojas')
        .select('id, nome')
        .order('nome');
      
      if (data) {
        setLojas(data);
      }
    };

    fetchLojas();
  }, []);

  useEffect(() => {
    const fetchMetricas = async () => {
      let query = supabase
        .from('atendimentos')
        .select(`
          valor_venda,
          venda_efetuada,
          loja_id,
          lojas!inner (
            id,
            nome
          ),
          vendedores!inner (
            id,
            ativo
          )
        `);

      // Apply store filter if selected
      if (selectedLoja !== "Todas") {
        const loja = lojas.find(l => l.nome === selectedLoja);
        if (loja) {
          query = query.eq('loja_id', loja.id);
        }
      }

      const { data: atendimentos } = await query;

      if (atendimentos) {
        // Calculate total sales value
        const totalVendas = atendimentos.reduce((acc, curr) => 
          curr.venda_efetuada ? acc + Number(curr.valor_venda || 0) : acc, 0);

        // Count active sellers
        const vendedoresAtivos = new Set(
          atendimentos.filter(a => a.vendedores.ativo).map(a => a.vendedores.id)
        ).size;

        // Calculate average sale value
        const vendasEfetuadas = atendimentos.filter(a => a.venda_efetuada);
        const mediaVenda = vendasEfetuadas.length > 0
          ? totalVendas / vendasEfetuadas.length
          : 0;

        // Calculate conversion rate
        const taxaConversao = atendimentos.length > 0
          ? (vendasEfetuadas.length / atendimentos.length) * 100
          : 0;

        setMetricas({
          vendasTotais: totalVendas,
          vendedoresAtivos,
          mediaVenda,
          taxaConversao
        });
      }
    };

    fetchMetricas();
  }, [selectedLoja, lojas]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(`Relatório de Vendas ${selectedLoja !== "Todas" ? `- ${selectedLoja}` : ""}`, 20, 20);
    
    // Metrics
    doc.setFontSize(14);
    doc.text("Métricas Gerais", 20, 40);
    doc.setFontSize(12);
    doc.text(`Vendas Totais: R$ ${metricas.vendasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 50);
    doc.text(`Vendedores Ativos: ${metricas.vendedoresAtivos}`, 20, 60);
    doc.text(`Média por Venda: R$ ${metricas.mediaVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 70);
    doc.text(`Taxa de Conversão: ${metricas.taxaConversao.toFixed(2)}%`, 20, 80);
    
    doc.save(`relatorio-vendas${selectedLoja !== "Todas" ? `-${selectedLoja.toLowerCase()}` : ""}.pdf`);
    toast({
      title: "PDF exportado com sucesso!",
      description: "O relatório foi salvo como PDF",
    });
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Metrics
    const metricasData = [
      [`Métricas Gerais ${selectedLoja !== "Todas" ? `- ${selectedLoja}` : ""}`],
      ["Vendas Totais", `R$ ${metricas.vendasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ["Vendedores Ativos", metricas.vendedoresAtivos],
      ["Média por Venda", `R$ ${metricas.mediaVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ["Taxa de Conversão", `${metricas.taxaConversao.toFixed(2)}%`],
    ];
    
    const metricasSheet = XLSX.utils.aoa_to_sheet(metricasData);
    XLSX.utils.book_append_sheet(workbook, metricasSheet, "Métricas");
    
    XLSX.writeFile(workbook, `relatorio-vendas${selectedLoja !== "Todas" ? `-${selectedLoja.toLowerCase()}` : ""}.xlsx`);
    toast({
      title: "Excel exportado com sucesso!",
      description: "O relatório foi salvo como Excel",
    });
  };

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
                    Filtrar por Loja:
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        {selectedLoja}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-800">
                      <DropdownMenuItem onClick={() => setSelectedLoja("Todas")}>
                        Todas
                      </DropdownMenuItem>
                      {lojas.map((loja) => (
                        <DropdownMenuItem
                          key={loja.id}
                          onClick={() => setSelectedLoja(loja.nome)}
                        >
                          {loja.nome}
                        </DropdownMenuItem>
                      ))}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Vendas Totais
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          R$ {metricas.vendasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Vendedores Ativos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metricas.vendedoresAtivos}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Média por Venda
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          R$ {metricas.mediaVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Taxa de Conversão
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metricas.taxaConversao.toFixed(2)}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ranking de Lojas</CardTitle>
                </CardHeader>
                <CardContent>
                  <LojaRanking selectedLoja={selectedLoja} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Relatorios;