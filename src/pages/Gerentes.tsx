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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  loja_id: z.string().min(1, "Selecione uma loja"),
})

type Manager = {
  id: number
  nome: string
  email: string
  tipo: string
  loja_id: number | null
}

type Store = {
  id: number
  nome: string
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
      loja_id: undefined,
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

  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lojas")
        .select("id, nome")
        .order("nome")

      if (error) throw error
      return data as Store[]
    },
  })

  const createManager = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      try {
        // First check if user exists in usuarios table
        const { data: existingUser, error: queryError } = await supabase
          .from("usuarios")
          .select("id")
          .eq("email", values.email)
          .maybeSingle()

        if (queryError) {
          console.error("Error checking existing user:", queryError)
          throw new Error("Erro ao verificar usuário existente")
        }

        if (existingUser) {
          throw new Error("Este email já está cadastrado no sistema")
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.senha,
          options: {
            data: {
              nome: values.nome,
              role: "gerente",
              loja_id: parseInt(values.loja_id),
            },
          },
        })

        if (authError) {
          console.error("Error creating auth user:", authError)
          if (authError.message.includes("already registered")) {
            throw new Error("Este email já está registrado no sistema")
          }
          throw authError
        }

        if (!authData.user?.id) {
          throw new Error("Erro ao criar usuário")
        }

        // Create usuarios record
        const { error: userError } = await supabase
          .from("usuarios")
          .insert([
            {
              nome: values.nome,
              email: values.email,
              senha: values.senha,
              tipo: "gerente",
              loja_id: parseInt(values.loja_id),
              user_id: authData.user.id,
            },
          ])

        if (userError) {
          console.error("Error creating usuario:", userError)
          // Since we can't delete the auth user from client side,
          // we'll just show an error message
          throw new Error("Erro ao criar usuário no sistema. Por favor, contate o suporte.")
        }

        return authData
      } catch (error: any) {
        console.error("Error creating manager:", error)
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
                      <FormField
                        control={form.control}
                        name="loja_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loja</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma loja" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {stores?.map((store) => (
                                  <SelectItem key={store.id} value={store.id.toString()}>
                                    {store.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                      <div>{stores?.find(store => store.id === manager.loja_id)?.nome || "Não atribuída"}</div>
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