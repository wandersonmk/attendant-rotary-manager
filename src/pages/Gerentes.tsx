import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2 } from "lucide-react"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type Manager = {
  id: number
  nome: string
  email: string
  tipo: string
  loja_id: number | null
}

const Gerentes = () => {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
    },
  })

  const { data: managers, isLoading } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("tipo", "gerente")
        .order("id", { ascending: false })

      if (error) throw error
      return data as Manager[]
    },
  })

  const createManager = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      try {
        // Primeiro, cria o usuário no auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.senha,
          options: {
            data: {
              nome: values.nome,
              role: "gerente",
            },
          },
        })

        if (authError) {
          // Check for specific error types
          if (authError.message === "User already registered") {
            throw new Error("Este email já está registrado no sistema")
          }
          throw authError
        }

        // Se chegou aqui, o usuário foi criado com sucesso no auth
        // O trigger handle_new_auth_user já vai criar o registro na tabela usuarios
        return authData
      } catch (error: any) {
        // Properly handle and rethrow the error
        if (error.message === "Este email já está registrado no sistema") {
          throw error
        }
        throw new Error(error.message || "Erro ao criar gerente")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] })
      toast({
        variant: "success",
        title: "Gerente criado com sucesso!",
        description: "Um email será enviado com as instruções de acesso.",
      })
      setIsOpen(false)
      form.reset()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar gerente",
        description: error.message,
      })
    },
  })

  const deleteManager = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("usuarios").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] })
      toast({
        title: "Gerente removido com sucesso!",
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao remover gerente",
        description: "Tente novamente mais tarde.",
      })
    },
  })

  const filteredManagers = managers?.filter((manager) =>
    manager.nome.toLowerCase().includes(search.toLowerCase()) ||
    manager.email.toLowerCase().includes(search.toLowerCase())
  )

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createManager.mutate(values)
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-[#1A1F2C]">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Gerentes
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie os gerentes de todas as lojas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar gerente..."
                  className="pl-10 w-64 bg-white dark:bg-gray-800"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Gerente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Gerente</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar um novo gerente
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="senha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Provisória</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={createManager.isPending}>
                        {createManager.isPending ? "Criando..." : "Criar Gerente"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Gerentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg font-medium">
                  <div>Nome</div>
                  <div>Email</div>
                  <div>Loja</div>
                  <div>Ações</div>
                </div>
                {isLoading ? (
                  <div className="text-center py-4">Carregando...</div>
                ) : (
                  filteredManagers?.map((manager) => (
                    <div key={manager.id} className="grid grid-cols-4 gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg items-center">
                      <div>{manager.nome}</div>
                      <div className="text-gray-600 dark:text-gray-300">{manager.email}</div>
                      <div>{manager.loja_id || "Não atribuída"}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => deleteManager.mutate(manager.id)}
                          disabled={deleteManager.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Gerentes