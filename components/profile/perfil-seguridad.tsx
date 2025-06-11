"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Shield, Key, Smartphone, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, Monitor } from "lucide-react"

export default function PerfilSeguridad() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error("The passwords do not match")
            return
        }

        if (newPassword.length < 8) {
            toast.error("The new password must have at least 8 characters")
            return
        }

        setIsLoading(true)

        // Simulación de cambio de contraseña
        setTimeout(() => {
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setIsLoading(false)

            toast.success("Password updated successfully")
        }, 2000)
    }

    const handleToggle2FA = () => {
        setIsLoading(true)

        // Simulación de activación/desactivación de 2FA
        setTimeout(() => {
            setTwoFactorEnabled(!twoFactorEnabled)
            setIsLoading(false)

            toast.success(twoFactorEnabled ? "2FA disabled" : "2FA enabled")
        }, 1500)
    }

    // Simulación de sesiones activas
    const sesionesActivas = [
        {
            id: "1",
            dispositivo: "Chrome en Windows",
            ubicacion: "Ciudad de México, México",
            fechaAcceso: "Hace 5 minutos",
            actual: true,
        },
        {
            id: "2",
            dispositivo: "Safari en iPhone",
            ubicacion: "Ciudad de México, México",
            fechaAcceso: "Hace 2 horas",
            actual: false,
        },
        {
            id: "3",
            dispositivo: "Firefox en macOS",
            ubicacion: "Guadalajara, México",
            fechaAcceso: "Hace 1 día",
            actual: false,
        },
    ]

    const cerrarSesion = () => {
        toast.success(
            "Session closed"
        )
    }

    const cerrarTodasLasSesiones = () => {
        toast.success(
            "All sessions closed"
        )
    }

    return (
        <div className="space-y-6">
            {/* Estado de seguridad */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Status
                    </CardTitle>
                    <CardDescription>Summary of your account security status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800">Secure password</p>
                                    <p className="text-sm text-green-600">Last update 30 days ago</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`flex items-center justify-between p-3 rounded-lg border ${twoFactorEnabled ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {twoFactorEnabled ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                )}
                                <div>
                                    <p className={`font-medium ${twoFactorEnabled ? "text-green-800" : "text-yellow-800"}`}>
                                        2FA Authentication
                                    </p>
                                    <p className={`text-sm ${twoFactorEnabled ? "text-green-600" : "text-yellow-600"}`}>
                                        {twoFactorEnabled ? "Enabled" : "Recommended to enable"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cambiar contraseña */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    disabled={isLoading}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nueva contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    disabled={isLoading}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
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
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Changing..." : "Change password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Autenticación de dos factores */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account with two-factor authentication
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Estado de 2FA</p>
                            <p className="text-sm text-muted-foreground">
                                {twoFactorEnabled
                                    ? "Two-factor authentication is enabled"
                                    : "Two-factor authentication is disabled"}
                            </p>
                        </div>
                        <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} disabled={isLoading} />
                    </div>

                    {!twoFactorEnabled && (
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                We recommend enabling two-factor authentication for greater security. This will require an additional code
                                from your phone every time you log in.
                            </AlertDescription>
                        </Alert>
                    )}

                    {twoFactorEnabled && (
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                Your account is protected with two-factor authentication. You will need your mobile device to
                                log in.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Sesiones activas */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5" />
                                Active Sessions
                            </CardTitle>
                            <CardDescription>Devices where you have logged in recently</CardDescription>
                        </div>
                        <Button variant="outline" onClick={cerrarTodasLasSesiones}>
                            Close all sessions
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sesionesActivas.map((sesion) => (
                            <div key={sesion.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                                <div className="flex items-center gap-3">
                                    <Monitor className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{sesion.dispositivo}</p>
                                            {sesion.actual && <Badge variant="secondary">Current session</Badge>}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{sesion.ubicacion}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>{sesion.fechaAcceso}</span>
                                        </div>
                                    </div>
                                </div>
                                {!sesion.actual && (
                                    <Button variant="outline" size="sm" onClick={cerrarSesion}>
                                        Close session
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
