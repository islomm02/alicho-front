import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">AliCho Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Xush kelibsiz!</span>
            <Link href="/">
              <Button variant="outline">Bosh sahifa</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Biznes avtomatlashtirishni boshqarish paneli</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Instagram Integratsiyasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Instagram hisobingizni ulang va avtomatik javoblarni sozlang</p>
              <Button className="bg-purple-600 hover:bg-purple-700">Ulash</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AmoCRM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">CRM tizimingizni ulang va mijozlarni avtomatik boshqaring</p>
              <Button className="bg-purple-600 hover:bg-purple-700">Ulash</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Telegram Bot</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Telegram bot orqali mijozlar bilan avtomatik muloqot qiling</p>
              <Button className="bg-purple-600 hover:bg-purple-700">Sozlash</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistika</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Biznes ko'rsatkichlaringizni kuzatib boring</p>
              <Button variant="outline">Ko'rish</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Yordamchi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">AI yordamchi sozlamalarini boshqaring</p>
              <Button variant="outline">Sozlash</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hisobotlar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Batafsil hisobotlarni ko'ring va yuklab oling</p>
              <Button variant="outline">Hisobotlar</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
