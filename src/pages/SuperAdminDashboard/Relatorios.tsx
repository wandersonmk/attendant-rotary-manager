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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('loja_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (userData?.loja_id) {
          // Get total sales
          const { data: salesData } = await supabase
            .from('metricas')
            .select('total_vendas')
            .eq('loja_id', userData.loja_id)
            .maybeSingle();

          // Get active sellers count
          const { count: activeVendedores } = await supabase
            .from('vendedores')
            .select('*', { count: 'exact', head: true })
            .eq('loja_id', userData.loja_id)
            .eq('ativo', true);

          // Get completed sales for average calculation
          const { data: completedSales } = await supabase
            .from('atendimentos')
            .select('valor_venda')
            .eq('loja_id', userData.loja_id)
            .eq('venda_efetuada', true)
            .not('valor_venda', 'is', null);

          // Calculate average sale value
          const totalSalesValue = completedSales?.reduce((acc, curr) => acc + Number(curr.valor_venda || 0), 0) || 0;
          const averageSale = completedSales?.length ? totalSalesValue / completedSales.length : 0;

          // Calculate conversion rate
          const { count: totalAtendimentos } = await supabase
            .from('atendimentos')
            .select('*', { count: 'exact', head: true })
            .eq('loja_id', userData.loja_id);

          const { count: successfulSales } = await supabase
            .from('atendimentos')
            .select('*', { count: 'exact', head: true })
            .eq('loja_id', userData.loja_id)
            .eq('venda_efetuada', true);

          const conversionRate = totalAtendimentos ? (successfulSales / totalAtendimentos) * 100 : 0;

          setMetricas({
            vendasTotais: Number(salesData?.total_vendas || 0),
            vendedoresAtivos: activeVendedores || 0,
            mediaVenda: averageSale,
            taxaConversao: conversionRate
          });
        }
      }
    };

    fetchMetricas();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text("Relatório de Vendas", 20, 20);
    
    // Métricas
    doc.setFontSize(14);
    doc.text("Métricas Gerais", 20, 40);
    doc.setFontSize(12);
    doc.text(`Vendas Totais: R$ ${metricas.vendasTotais.toLocaleString()}`, 20, 50);
    doc.text(`Vendedores Ativos: ${metricas.vendedoresAtivos}`, 20, 60);
    doc.text(`Média por Venda: R$ ${metricas.mediaVenda.toLocaleString()}`, 20, 70);
    doc.text(`Taxa de Conversão: ${metricas.taxaConversao}%`, 20, 80);
    
    // Ranking
    doc.setFontSize(14);
    doc.text("Ranking de Vendedores", 20, 100);
    doc.setFontSize(12);
    
    doc.save("relatorio-vendas.pdf");
    toast({
      title: "PDF exportado com sucesso!",
      description: "O relatório foi salvo como 'relatorio-vendas.pdf'",
    });
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Métricas
    const metricasData = [
      ["Métricas Gerais"],
      ["Vendas Totais", `R$ ${metricas.vendasTotais.toLocaleString()}`],
      ["Vendedores Ativos", metricas.vendedoresAtivos],
      ["Média por Venda", `R$ ${metricas.mediaVenda.toLocaleString()}`],
      ["Taxa de Conversão", `${metricas.taxaConversao}%`],
    ];
    
    const metricasSheet = XLSX.utils.aoa_to_sheet(metricasData);
    XLSX.utils.book_append_sheet(workbook, metricasSheet, "Métricas");
    
    XLSX.writeFile(workbook, "relatorio-vendas.xlsx");
    toast({
      title: "Excel exportado com sucesso!",
      description: "O relatório foi salvo como 'relatorio-vendas.xlsx'",
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
                  <MetricasLoja />
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
