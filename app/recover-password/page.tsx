"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertTriangle, Lock } from "lucide-react"
import { supabase } from "@/lib/supabase"

function RestablecerContrasenaContent() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [tokenValid, setTokenValid] = useState<boolean | null>(null)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [email, setEmail] = useState("")
    const [resetSuccess, setResetSuccess] = useState(false)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error || !session) {
                setTokenValid(false)
                return
            }

            setTokenValid(true)
            setEmail(session.user.email || "")
        }

        checkSession()
    }, [])

    useEffect(() => {
        // Calcular fortaleza de la contraseña
        let strength = 0
        if (password.length >= 8) strength += 25
        if (/[A-Z]/.test(password)) strength += 25
        if (/[a-z]/.test(password)) strength += 25
        if (/[0-9]/.test(password)) strength += 12.5
        if (/[^A-Za-z0-9]/.test(password)) strength += 12.5

        setPasswordStrength(Math.min(strength, 100))
    }, [password])

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 25) return "bg-red-500"
        if (passwordStrength < 50) return "bg-orange-500"
        if (passwordStrength < 75) return "bg-yellow-500"
        return "bg-green-500"
    }

    const getPasswordStrengthText = () => {
        if (passwordStrength < 25) return "Very weak"
        if (passwordStrength < 50) return "Weak"
        if (passwordStrength < 75) return "Good"
        return "Strong"
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("The passwords do not match")
            return
        }

        if (password.length < 8) {
            toast.error("The password must have at least 8 characters")
            return
        }

        if (passwordStrength < 50) {
            toast.error("Please use a stronger password")
            return
        }

        setIsLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) {
                toast.error("Error updating the password", {
                    description: error.message
                })
                return
            }

            setResetSuccess(true)
            toast.success("Password updated successfully")

            // Cerrar todas las sesiones excepto la actual
            await supabase.auth.signOut({ scope: 'others' })

        } catch (error) {
            console.error("Unexpected error:", error)
            toast.error("Error connecting to the server")
        } finally {
            setIsLoading(false)
        }
    }

    // Loading state mientras se valida el token
    if (tokenValid === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                        <p className="text-muted-foreground">Validating link...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Token inválido o expirado
    if (!tokenValid) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Invalid link</CardTitle>
                        <CardDescription>This reset link is invalid or has expired</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Reset links expire after 24 hours for security. Request a new link to reset your password.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button className="w-full" asChild>
                            <Link href="/forgot-password">Request new link</Link>
                        </Button>
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

    // Éxito al restablecer contraseña
    if (resetSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Password reset</CardTitle>
                        <CardDescription>Your password has been updated successfully</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <Lock className="h-4 w-4" />
                            <AlertDescription>
                                Now you can log in with your new password. For security, we have closed all other active sessions.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Formulario para restablecer contraseña
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">New password</CardTitle>
                    <CardDescription>
                        {email ? `Resetting password for ${email}` : "Enter your new password"}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>

                            {password && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Strength:</span>
                                        <span
                                            className={`font-medium ${passwordStrength >= 75 ? "text-green-600" : passwordStrength >= 50 ? "text-yellow-600" : "text-red-600"}`}
                                        >
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <Progress value={passwordStrength} className="h-2">
                                        <div
                                            className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`}
                                            style={{ width: `${passwordStrength}%` }}
                                        />
                                    </Progress>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>

                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-sm text-red-600">The passwords do not match</p>
                            )}
                        </div>

                        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 my-3">
                            <p className="font-medium mb-1">Password requirements:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li className={password.length >= 8 ? "text-green-700" : ""}>At least 8 characters</li>
                                <li className={/[A-Z]/.test(password) ? "text-green-700" : ""}>One uppercase letter</li>
                                <li className={/[a-z]/.test(password) ? "text-green-700" : ""}>One lowercase letter</li>
                                <li className={/[0-9]/.test(password) ? "text-green-700" : ""}>One number</li>
                                <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-700" : ""}>One special character</li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || password !== confirmPassword || passwordStrength < 50}
                        >
                            {isLoading ? "Resetting..." : "Reset password"}
                        </Button>

                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/login">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to login
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default function RestablecerContrasenaPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                            <p className="text-muted-foreground">Loading...</p>
                        </CardContent>
                    </Card>
                </div>
            }
        >
            <RestablecerContrasenaContent />
        </Suspense>
    )
}
