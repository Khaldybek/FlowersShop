import { type NextRequest, NextResponse } from "next/server"

// Mock orders data
const mockOrders = [
    {
        id: 1,
        customer_name: "Иван Иванов",
        phone: "+7 (999) 123-45-67",
        email: "ivan@example.com",
        delivery_address: "ул. Примерная, д. 1",
        delivery_date: "2024-03-20",
        delivery_time: "14:00",
        payment_method: "card",
        notes: "Доставить к 14:00",
        items: [
            {
                bouquet_id: 1,
                name: "Букет роз 'Классика'",
                price: 2500,
                quantity: 2,
                image: "/placeholder.svg?height=400&width=400&text=Розы",
            },
        ],
        total_amount: 5000,
        status: "pending",
        created_at: "2024-01-01T00:00:00Z",
    },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check authentication
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const id = Number.parseInt(params.id)
        const order = mockOrders.find((o) => o.id === id)

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            order,
        })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check authentication
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const id = Number.parseInt(params.id)
        const orderIndex = mockOrders.findIndex((o) => o.id === id)

        if (orderIndex === -1) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
        }

        const updateData = await request.json()
        const updatedOrder = {
            ...mockOrders[orderIndex],
            ...updateData,
        }

        mockOrders[orderIndex] = updatedOrder

        return NextResponse.json({
            success: true,
            order: updatedOrder,
        })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check authentication
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const id = Number.parseInt(params.id)
        const orderIndex = mockOrders.findIndex((o) => o.id === id)

        if (orderIndex === -1) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
        }

        mockOrders.splice(orderIndex, 1)

        return NextResponse.json({
            success: true,
            message: "Order deleted successfully",
        })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}
