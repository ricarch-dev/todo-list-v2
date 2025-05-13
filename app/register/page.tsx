"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showEmailAlert, setShowEmailAlert] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres")
            return
        }

        setIsLoading(true)

        try {
            // Registrar usuario con Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    },
                },
            })

            if (error) {
                toast.error(error.message || "Error al crear cuenta", {
                    description: error instanceof Error ? error.message : "Error desconocido"
                })
                return
            }

            toast.success("Cuenta creada exitosamente", {
                description: `Se ha enviado un email a ${data.user?.email}`
            })

            // Guardar el email registrado y mostrar alerta
            setRegisteredEmail(email)
            setShowEmailAlert(true)

        } catch (error) {
            console.error("Error inesperado: ", error)
            toast.error("Error al conectar con el servidor")
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirmation = async () => {
        try {
            // Iniciar sesión automáticamente
            const { data, error } = await supabase.auth.signInWithPassword({
                email: registeredEmail,
                password,
            })

            if (error) {
                toast.error("Error al iniciar sesión", {
                    description: error.message
                })
                return
            }

            console.log("Inicio de sesión exitoso tras confirmar email:", data.user?.email)
            // Redirigir al dashboard
            router.push("/dashboard")
        } catch (error) {
            console.error("Error inesperado:", error)
            toast.error("Error al iniciar sesión")
        }
    }

    const goToGmail = () => {
        window.open('https://mail.google.com', '_blank')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <AlertDialog open={showEmailAlert} onOpenChange={setShowEmailAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirma tu correo electrónico</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hemos enviado un correo de confirmación a <strong>{registeredEmail}</strong>.
                            Por favor, revisa tu bandeja de entrada y haz clic en el enlace de confirmación.
                            Después de confirmar, puedes continuar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={goToGmail}
                        >
                            Ir a Gmail
                        </Button>
                        <div className="flex justify-end gap-2 w-full">
                            <AlertDialogCancel>Cerrar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmation}>
                                He confirmado mi email
                            </AlertDialogAction>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
                    <CardDescription>Ingresa tus datos para crear una nueva cuenta</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input
                                id="name"
                                placeholder="Nombre Apellido"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
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
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                        </Button>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            ¿Ya tienes una cuenta?{" "}
                            <Button variant="link" className="p-0 font-normal" asChild>
                                <Link href="/login">Inicia sesión</Link>
                            </Button>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
