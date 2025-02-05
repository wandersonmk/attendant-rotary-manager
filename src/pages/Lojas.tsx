import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { supabase } from "@/integrations/supabase/client"

interface Loja {
  id: number
  nome: string
  endereco: string | null
  telefone: string | null
}

export default function Lojas() {
  const [lojas, setLojas] = useState<Loja[]>([])

  useEffect(() => {
    const fetchLojas = async () => {
      const { data } = await supabase
        .from('lojas')
        .select('*')
        .neq('nome', 'Administrador')  // Filter out "Administrador"
        .order('nome')

      if (data) {
        setLojas(data)
      }
    }

    fetchLojas()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lojas</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie todas as lojas do sistema
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lojas.map((loja) => (
            <Card key={loja.id}>
              <CardHeader>
                <CardTitle>{loja.nome}</CardTitle>
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