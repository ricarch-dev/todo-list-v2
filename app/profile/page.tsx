"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import type { User } from "@/types/user"
import type { Todo } from "@/types/todo"
import PerfilInformacion from "@/components/profile/perfil-informacion"
import PerfilEstadisticas from "@/components/profile/perfil-estadisticas"
import PerfilActividad from "@/components/profile/perfil-actividad"
import PerfilSeguridad from "@/components/profile/perfil-seguridad"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function PerfilPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user: supabaseUser } } = await supabase.auth.getUser()

                if (!supabaseUser) {
                    router.push('/login')
                    return
                }

                // Adaptar el usuario de Supabase a nuestro tipo User
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

                // Cargar todos para estadísticas
                const storedTodos = localStorage.getItem("todos")
                if (storedTodos) {
                    setTodos(JSON.parse(storedTodos))
                }
            } catch (error) {
                console.error(error)
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        getUser()
    }, [router])

    const updateUser = (nuevoUsuario: User) => {
        setUser(nuevoUsuario)
        // Actualizar los metadatos del usuario en Supabase
        supabase.auth.updateUser({
            data: {
                name: nuevoUsuario.name,
                avatar_url: nuevoUsuario.avatar,
                bio: nuevoUsuario.bio,
                ubicacion: nuevoUsuario.ubicacion,
                telefono: nuevoUsuario.telefono,
                sitioWeb: nuevoUsuario.sitioWeb
            }
        }).catch(error => {
            console.error('Error updating user:', error)
            toast.error('Error updating user')
        })
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <DashboardHeader user={user!} />

            <main className="flex-1 p-4 md:p-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-muted-foreground">Manage your personal information and account settings</p>
                    </div>

                    <Tabs defaultValue="informacion" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                            <TabsTrigger value="informacion">Information</TabsTrigger>
                            <TabsTrigger value="estadisticas">Statistics</TabsTrigger>
                            <TabsTrigger value="actividad">Activity</TabsTrigger>
                            <TabsTrigger value="seguridad">Security</TabsTrigger>
                        </TabsList>

                        <TabsContent value="informacion">
                            <PerfilInformacion user={user!} updateUser={updateUser} />
                        </TabsContent>

                        <TabsContent value="estadisticas">
                            <PerfilEstadisticas todos={todos} />
                        </TabsContent>

                        <TabsContent value="actividad">
                            <PerfilActividad todos={todos} />
                        </TabsContent>

                        <TabsContent value="seguridad">
                            <PerfilSeguridad />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
