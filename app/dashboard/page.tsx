"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import TodoList from "@/components/todo-list"
import type { User } from "@/types/user"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const storedUser = localStorage.getItem("user")
        if (!storedUser) {
            router.push("/login")
            return
        }

        setUser(JSON.parse(storedUser))
        setLoading(false)
    }, [router])

    if (loading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Cargando...</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <DashboardHeader user={user} />

            <main className="flex-1 p-4 md:p-6">
                <div className="mx-auto max-w-6xl">
                    <Tabs defaultValue="todos">
                        <TabsList className="mb-4">
                            <TabsTrigger value="todos">Todas las tareas</TabsTrigger>
                            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                            <TabsTrigger value="completadas">Completadas</TabsTrigger>
                            <TabsTrigger value="alta">Alta prioridad</TabsTrigger>
                        </TabsList>

                        <TabsContent value="todos">
                            <TodoList filter="todos" />
                        </TabsContent>

                        <TabsContent value="pendientes">
                            <TodoList filter="pendientes" />
                        </TabsContent>

                        <TabsContent value="completadas">
                            <TodoList filter="completadas" />
                        </TabsContent>

                        <TabsContent value="alta">
                            <TodoList filter="alta" />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
