"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import TodoList from "@/components/todo-list"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { toast } from "sonner"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verificar si el usuario está autenticado con Supabase
        const checkUser = async () => {
            try {
                console.log("Dashboard - Verificando sesión...")
                const { data: { user }, error } = await supabase.auth.getUser()

                if (error) {
                    console.error("Error al obtener usuario:", error)
                    toast.error("Error al verificar tu sesión")
                    router.push("/login")
                    return
                }

                console.log("Dashboard - Usuario:", user ? "Autenticado" : "No autenticado")

                if (!user) {
                    console.log("Dashboard - Usuario no autenticado, redirigiendo a login")
                    router.push("/login")
                    return
                }

                console.log("Dashboard - Usuario autenticado:", user.email)
                setUser(user)
            } catch (error) {
                console.error("Error al verificar usuario:", error)
                toast.error("Error inesperado al verificar tu sesión")
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }

        checkUser()
    }, [router])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Cargando...</p>
            </div>
        )
    }

    if (!user) {
        return null // No debería mostrarse, pero por seguridad
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
