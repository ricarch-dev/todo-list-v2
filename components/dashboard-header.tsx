"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface DashboardHeaderProps {
    user: User
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            toast.success("Sesión cerrada correctamente")
            router.push("/login")
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
            toast.error("Error al cerrar sesión")
        }
    }

    const getInitials = (email: string) => {
        // Si no hay nombre disponible, usamos el email
        return email
            .split("@")[0]
            .substring(0, 2)
            .toUpperCase()
    }

    return (
        <header className="border-b bg-background">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-xl font-bold">Organizador de Tareas</span>
                </Link>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar>
                                    <AvatarFallback>{getInitials(user.email || "")}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <div className="flex items-center justify-start gap-2 p-2">
                                <div className="flex flex-col space-y-1 leading-none">
                                    <p className="font-medium">{user.email}</p>
                                    <p className="text-sm text-muted-foreground">{user.id.substring(0, 8)}</p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/perfil">Perfil</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/configuracion">Configuración</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
