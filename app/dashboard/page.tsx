"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import TodoList from "@/components/todo-list"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    router.push('/login')
                    return
                }

                setUser(user)
            } catch (error) {
                console.error(error)
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        getUser()
    }, [router])

    if (loading) return <div>Cargando...</div>
    if (!user) return null

    return (
        <div className="flex min-h-screen flex-col">
            <DashboardHeader user={user} />

            <main className="flex-1 p-4 md:p-6">
                <div className="mx-auto max-w-6xl">
                    <Tabs defaultValue="todos">
                        <TabsList className="mb-4">
                            <TabsTrigger value="todos">All</TabsTrigger>
                            <TabsTrigger value="pendientes">Pending</TabsTrigger>
                            <TabsTrigger value="completadas">Completed</TabsTrigger>
                            <TabsTrigger value="alta">High Priority</TabsTrigger>
                        </TabsList>

                        <TabsContent value="todos">
                            <TodoList filter="todos" />
                        </TabsContent>

                        <TabsContent value="pendientes">
                            <TodoList filter="pending" />
                        </TabsContent>

                        <TabsContent value="completadas">
                            <TodoList filter="completed" />
                        </TabsContent>

                        <TabsContent value="alta">
                            <TodoList filter="high" />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
