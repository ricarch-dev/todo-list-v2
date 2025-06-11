"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function RecuperarContrasenaPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Por favor, ingresa tu email")
            return
        }

        setIsLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/recover-password`,
            })

            if (error) {
                toast.error("Error al enviar el email", {
                    description: error.message
                })
                return
            }

            setEmailSent(true)
            toast.success("Email enviado", {
                description: "Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña"
            })
        } catch (error) {
            console.error("Error inesperado:", error)
            toast.error("Error al conectar con el servidor")
        } finally {
            setIsLoading(false)
        }
    }

    if (emailSent) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Email sent</CardTitle>
                        <CardDescription>We have sent a reset link to your email</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <Mail className="h-4 w-4" />
                            <AlertDescription>
                                Check your inbox and click on the link to reset your password. The link will expire
                                in 24 hours.
                            </AlertDescription>
                        </Alert>

                        <div className="text-center text-sm text-muted-foreground">
                            <p>Did you not receive the email?</p>
                            <Button
                                variant="link"
                                className="p-0 h-auto font-normal"
                                onClick={() => {
                                    setEmailSent(false)
                                    setEmail("")
                                }}
                            >
                                Try with another email
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/login">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to login
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Recover password</CardTitle>
                    <CardDescription>
                        Enter your email and we will send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <Alert className="bg-blue-50 border-blue-200 my-3">
                            <Mail className="h-4 w-4" />
                            <AlertDescription>
                                We will send you a secure link to reset your password. Also check your spam folder.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send recovery link"}
                        </Button>

                        <div className="flex items-center justify-center space-x-2 text-sm">
                            <span className="text-muted-foreground">Did you remember your password?</span>
                            <Button variant="link" className="p-0 font-normal" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
