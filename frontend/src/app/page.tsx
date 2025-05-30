import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Shield, Clock, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-pink-100 text-pink-800">Свежие цветы каждый день</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Прекрасные букеты для
            <span className="text-pink-600"> особых моментов</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Создаем незабываемые эмоции с помощью свежих цветов. Доставка по всему городу в день заказа.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                Смотреть каталог
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Связаться с нами
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">Быстрая доставка</h3>
                <p className="text-sm text-gray-600">Доставляем в день заказа по всему городу</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">Гарантия качества</h3>
                <p className="text-sm text-gray-600">Только свежие цветы от проверенных поставщиков</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">Работаем 24/7</h3>
                <p className="text-sm text-gray-600">Принимаем заказы круглосуточно</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">Поддержка клиентов</h3>
                <p className="text-sm text-gray-600">Консультируем и помогаем с выбором</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Популярные букеты</h2>
            <p className="text-gray-600">Самые востребованные композиции наших клиентов</p>
          </div>



          <div className="text-center">
            <Link href="/catalog">
              <Button variant="outline" size="lg">
                Смотреть все букеты
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы сделать заказ?</h2>
          <p className="text-xl mb-8 opacity-90">Свяжитесь с нами для консультации или оформите заказ онлайн</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" variant="secondary">
                Выбрать букет
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-pink-600">
              Позвонить нам
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
