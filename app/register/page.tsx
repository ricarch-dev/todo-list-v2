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
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
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
                toast.error(error.message || "Error creating account", {
                    description: error instanceof Error ? error.message : "Unknown error"
                })
                return
            }

            toast.success("Account created successfully", {
                description: `An email has been sent to ${data.user?.email}`
            })

            // Guardar el email registrado y mostrar alerta
            setRegisteredEmail(email)
            setShowEmailAlert(true)

        } catch (error) {
            console.error("Error inesperado: ", error)
            toast.error("Error connecting to the server")
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
                toast.error("Error logging in", {
                    description: error.message
                })
                return
            }

            console.log("Login successful after confirming email:", data.user?.email)
            // Redirigir al dashboard
            router.push("/dashboard")
        } catch (error) {
            console.error("Error inesperado:", error)
            toast.error("Error logging in")
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
                        <AlertDialogTitle>Confirm your email</AlertDialogTitle>
                        <AlertDialogDescription>
                            We have sent a confirmation email to <strong>{registeredEmail}</strong>.
                            Please check your inbox and click on the confirmation link.
                            After confirming, you can continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={goToGmail}
                        >
                            Go to Gmail
                        </Button>
                        <div className="flex justify-end gap-2 w-full">
                            <AlertDialogCancel>Close</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmation}>
                                I have confirmed my email
                            </AlertDialogAction>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>Enter your data to create a new account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Button variant="link" className="p-0 font-normal" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
