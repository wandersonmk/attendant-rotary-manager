import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AtendimentoRotativo from "./pages/AtendimentoRotativo";
import NotFound from "./pages/NotFound";
import Vendedores from "./pages/Vendedores";
import Relatorios from "./pages/Relatorios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/vendedores" element={<Vendedores />} />
          <Route path="/manager/relatorios" element={<Relatorios />} />
          <Route path="/atendimento" element={<AtendimentoRotativo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;