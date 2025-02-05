import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, FileText, ChevronDown } from "lucide-react"
import { LojaRanking } from "@/components/LojaRanking"
import { toast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

interface LojaMetricas {
  id: number;
  nome: string;
  total_vendas: number;
  vendedores_ativos: number;
  media_venda: number;
  taxa_conversao: number;
}

const Relatorios = () => {
  const [selectedLoja, setSelectedLoja] = useState<string>("Todas");
  const [lojas, setLojas] = useState<{ id: number; nome: string; }[]>([]);
  const [lojasMetricas, setLojasMetricas] = useState<LojaMetricas[]>([]);
  const [metricas, setMetricas] = useState<MetricasData>({
    vendasTotais: 0,
    vendedoresAtivos: 0,
    mediaVenda: 0,
    taxaConversao: 0
  });

  useEffect(() => {
    const fetchLojas = async () => {
      const { data, error } = await supabase
        .from('lojas')
        .select('id, nome')
        .neq('nome', 'Administrador')
        .order('nome');
      
      if (error) {
        toast({
          title: "Erro ao carregar lojas",
          description: "Não foi possível carregar a lista de lojas.",
          variant: "destructive",
        });
        return;
      }
      
      if (data) {
        setLojas(data);
      }
    };

    fetchLojas();
  }, []);

  useEffect(() => {
    const fetchMetricasTodasLojas = async () => {
      const metricas: LojaMetricas[] = [];

      for (const loja of lojas) {
        // Get sales data
        const { data: vendasData } = await supabase
          .from('atendimentos')
          .select('valor_venda, venda_efetuada')
          .eq('loja_id', loja.id);

        // Get active sellers
        const { count: vendedoresAtivos } = await supabase
          .from('vendedores')
          .select('*', { count: 'exact', head: true })
          .eq('loja_id', loja.id)
          .eq('ativo', true);

        if (vendasData) {
          const vendasEfetuadas = vendasData.filter(v => v.venda_efetuada);
          const totalVendas = vendasEfetuadas.reduce((sum, venda) => 
            sum + Number(venda.valor_venda || 0), 0);
          const mediaVenda = vendasEfetuadas.length > 0 
            ? totalVendas / vendasEfetuadas.length 
            : 0;
          const taxaConversao = vendasData.length > 0
            ? (vendasEfetuadas.length / vendasData.length) * 100
            : 0;

          metricas.push({
            id: loja.id,
            nome: loja.nome,
            total_vendas: totalVendas,
            vendedores_ativos: vendedoresAtivos || 0,
            media_venda: mediaVenda,
            taxa_conversao: taxaConversao
          });
        }
      }

      setLojasMetricas(metricas.sort((a, b) => b.total_vendas - a.total_vendas));
    };

    if (lojas.length > 0) {
      fetchMetricasTodasLojas();
    }
  }, [lojas]);

  useEffect(() => {
    const fetchMetricasLojaSelecionada = async () => {
      if (selectedLoja === "Todas") {
        const totais = lojasMetricas.reduce((acc, loja) => ({
          vendasTotais: acc.vendasTotais + loja.total_vendas,
          vendedoresAtivos: acc.vendedoresAtivos + loja.vendedores_ativos,
          mediaVenda: acc.mediaVenda + loja.media_venda,
          taxaConversao: acc.taxaConversao + loja.taxa_conversao
        }), {
          vendasTotais: 0,
          vendedoresAtivos: 0,
          mediaVenda: 0,
          taxaConversao: 0
        });

        setMetricas({
          ...totais,
          mediaVenda: totais.mediaVenda / lojasMetricas.length,
          taxaConversao: totais.taxaConversao / lojasMetricas.length
        });
      } else {
        const lojaMetricas = lojasMetricas.find(l => l.nome === selectedLoja);
        if (lojaMetricas) {
          setMetricas({
            vendasTotais: lojaMetricas.total_vendas,
            vendedoresAtivos: lojaMetricas.vendedores_ativos,
            mediaVenda: lojaMetricas.media_venda,
            taxaConversao: lojaMetricas.taxa_conversao
          });
        }
      }
    };

    fetchMetricasLojaSelecionada();
  }, [selectedLoja, lojasMetricas]);

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-gray-800">
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
                          {metricas.vendasTotais.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
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
                          {metricas.mediaVenda.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
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
                          {metricas.taxaConversao.toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Métricas por Loja</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Loja</TableHead>
                          <TableHead className="text-right">Vendas Totais</TableHead>
                          <TableHead className="text-right">Vendedores</TableHead>
                          <TableHead className="text-right">Média/Venda</TableHead>
                          <TableHead className="text-right">Conversão</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lojasMetricas.map((loja) => (
                          <TableRow key={loja.id}>
                            <TableCell>{loja.nome}</TableCell>
                            <TableCell className="text-right">
                              {loja.total_vendas.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {loja.vendedores_ativos}
                            </TableCell>
                            <TableCell className="text-right">
                              {loja.media_venda.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {loja.taxa_conversao.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Relatorios;
