"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulación de inicio de sesión
        setTimeout(() => {
            if (email === "usuario@ejemplo.com" && password === "password") {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: "1",
                        name: "Usuario Ejemplo",
                        email,
                    }),
                )
                router.push("/dashboard")
            } else {
                toast.error("Credenciales incorrectas. Intenta con usuario@ejemplo.com y password")
            }
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
                    <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="usuario@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Button variant="link" size="sm" className="px-0 font-normal" asChild>
                                    <Link href="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
                                </Button>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            ¿No tienes una cuenta?{" "}
                            <Button variant="link" className="p-0 font-normal" asChild>
                                <Link href="/register">Regístrate</Link>
                            </Button>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
