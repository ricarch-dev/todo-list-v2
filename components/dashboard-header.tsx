"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/types/user"
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
            toast.success("Session closed successfully")
            router.push("/login")
        } catch (error) {
            console.error("Error closing session:", error)
            toast.error("Error closing session")
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
                    <span className="text-xl font-bold">Task Manager</span>
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
                                <Link href="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings">Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
