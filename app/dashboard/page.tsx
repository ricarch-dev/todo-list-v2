"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import TodoList from "@/components/todo-list"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types/user"

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user: supabaseUser } } = await supabase.auth.getUser()

                if (!supabaseUser) {
                    router.push('/login')
                    return
                }

                const adaptedUser: User = {
                    id: supabaseUser.id,
                    email: supabaseUser.email || '',
                    name: supabaseUser.user_metadata?.name || '',
                    avatar: supabaseUser.user_metadata?.avatar_url,
                    bio: supabaseUser.user_metadata?.bio,
                    ubicacion: supabaseUser.user_metadata?.ubicacion,
                    telefono: supabaseUser.user_metadata?.telefono,
                    sitioWeb: supabaseUser.user_metadata?.sitioWeb,
                    fechaRegistro: supabaseUser.created_at,
                    verificado: supabaseUser.email_confirmed_at != null
                }

                setUser(adaptedUser)
            } catch (error) {
                console.error(error)
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        getUser()
    }, [router])

    if (loading) return <div>Loading...</div>
    if (!user) return null

    return (
        <div className="flex min-h-screen flex-col">
            <DashboardHeader user={user} />

            <main className="flex-1 p-4 md:p-6">
                <div className="mx-auto max-w-6xl">
                    <Tabs defaultValue="todos">
                        <TabsList className="mb-4">
                            <TabsTrigger value="todos">All</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                            <TabsTrigger value="high">High Priority</TabsTrigger>
                        </TabsList>

                        <TabsContent value="todos">
                            <TodoList filter="todos" />
                        </TabsContent>

                        <TabsContent value="pending">
                            <TodoList filter="pending" />
                        </TabsContent>

                        <TabsContent value="completed">
                            <TodoList filter="completed" />
                        </TabsContent>

                        <TabsContent value="high">
                            <TodoList filter="high" />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
