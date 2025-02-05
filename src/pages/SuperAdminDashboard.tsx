import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { BarChart, LineChart } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

const SuperAdminDashboard = () => {
  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Dashboard: São Paulo, BR</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">DIA</Button>
              <Button variant="outline" size="sm">SEMANA</Button>
              <Button variant="outline" size="sm">MÊS</Button>
              <Button variant="outline" size="sm">ANO</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={[
                    { name: 'SAB', value: 100 },
                    { name: 'DOM', value: 150 },
                    { name: 'SEG', value: 120 },
                    { name: 'TER', value: 180 },
                    { name: 'QUA', value: 90 },
                    { name: 'QUI', value: 200 },
                    { name: 'SEX', value: 160 },
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Rendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={[
                    { name: 'SAB', value: 120 },
                    { name: 'DOM', value: 180 },
                    { name: 'SEG', value: 140 },
                    { name: 'TER', value: 200 },
                    { name: 'QUA', value: 160 },
                    { name: 'QUI', value: 130 },
                    { name: 'SEX', value: 170 },
                    { name: 'SAB', value: 210 },
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Temperatura das Bebidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-4">TAP</th>
                        <th className="pb-4">PRODUTO</th>
                        <th className="pb-4">SAB</th>
                        <th className="pb-4">DOM</th>
                        <th className="pb-4">SEG</th>
                        <th className="pb-4">TER</th>
                        <th className="pb-4">QUA</th>
                        <th className="pb-4">QUI</th>
                        <th className="pb-4">SEX</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { tap: 1, product: "SKOL", temps: [22, 22, 24, 22, 22, 22, 22] },
                        { tap: 2, product: "BRAHMA", temps: [24, 24, 25, 24, 0, 21, 14] },
                        { tap: 3, product: "HEINEKEN", temps: [15, 15, 25, 15, 15, 15, 15] },
                      ].map((row) => (
                        <tr key={row.tap} className="border-t">
                          <td className="py-4">{row.tap}</td>
                          <td className="py-4">{row.product}</td>
                          {row.temps.map((temp, i) => (
                            <td key={i} className="py-4">{temp}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard