"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Phone, Mail, Home } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
            <div className="container mx-auto px-4">
                <Card className="max-w-2xl mx-auto text-center">
                    <CardContent className="pt-8 pb-8">
                        <div className="mb-6">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Заказ успешно оформлен!</h1>
                            <p className="text-gray-600">
                                Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для подтверждения.
                            </p>
                        </div>

                        {orderId && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-600 mb-1">Номер заказа:</p>
                                <p className="text-xl font-bold text-pink-600">#{orderId}</p>
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span>Мы позвоним вам в течение 30 минут</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4" />
                                <span>Подтверждение отправлено на ваш email</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/catalog">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Продолжить покупки
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700">
                                    <Home className="h-4 w-4 mr-2" />
                                    На главную
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-semibold mb-2">Что дальше?</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>1. Мы обработаем ваш заказ и свяжемся с вами для подтверждения</p>
                                <p>2. Подготовим свежий букет в указанное время</p>
                                <p>3. Доставим заказ по указанному адресу</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
