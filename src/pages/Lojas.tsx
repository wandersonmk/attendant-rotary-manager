import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Loja {
  id: number
  nome: string
  endereco: string | null
  telefone: string | null
}

export default function Lojas() {
  const [lojas, setLojas] = useState<Loja[]>([])
  const [novaLoja, setNovaLoja] = useState({
    nome: "",
    endereco: "",
    telefone: "",
  })
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const fetchLojas = async () => {
    const { data } = await supabase
      .from('lojas')
      .select('*')
      .neq('nome', 'Administrador')
      .order('nome')

    if (data) {
      setLojas(data)
    }
  }

  useEffect(() => {
    fetchLojas()
  }, [])

  const handleAddLoja = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!novaLoja.nome.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome da loja é obrigatório",
      })
      return
    }

    const { error } = await supabase
      .from('lojas')
      .insert([
        {
          nome: novaLoja.nome,
          endereco: novaLoja.endereco || null,
          telefone: novaLoja.telefone || null,
        }
      ])

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar loja",
        description: error.message,
      })
    } else {
      toast({
        title: "Loja adicionada com sucesso",
        description: "A nova loja foi cadastrada no sistema",
      })
      setNovaLoja({ nome: "", endereco: "", telefone: "" })
      setIsOpen(false)
      fetchLojas()
    }
  }

  const handleDeleteLoja = async (id: number) => {
    const { error } = await supabase
      .from('lojas')
      .delete()
      .eq('id', id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover loja",
        description: error.message,
      })
    } else {
      toast({
        title: "Loja removida com sucesso",
        description: "A loja foi removida do sistema",
      })
      fetchLojas()
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Lojas</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gerencie todas as lojas do sistema
            </p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Loja
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Loja</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddLoja} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome da Loja</Label>
                  <Input
                    id="nome"
                    value={novaLoja.nome}
                    onChange={(e) => setNovaLoja({ ...novaLoja, nome: e.target.value })}
                    placeholder="Digite o nome da loja"
                  />
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={novaLoja.endereco}
                    onChange={(e) => setNovaLoja({ ...novaLoja, endereco: e.target.value })}
                    placeholder="Digite o endereço"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={novaLoja.telefone}
                    onChange={(e) => setNovaLoja({ ...novaLoja, telefone: e.target.value })}
                    placeholder="Digite o telefone"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Adicionar Loja
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lojas.map((loja) => (
            <Card key={loja.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{loja.nome}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteLoja(loja.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Endereço: {loja.endereco || 'Não informado'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Telefone: {loja.telefone || 'Não informado'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}