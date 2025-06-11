"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, Calendar, Mail, Edit } from "lucide-react"
import type { User } from "@/types/user"
import { toast } from "sonner"

interface PerfilInformacionProps {
    user: User
    updateUser: (user: User) => void
}

export default function PerfilInformacion({ user, updateUser }: PerfilInformacionProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [bio, setBio] = useState(user.bio || "")
    const [ubicacion, setUbicacion] = useState(user.ubicacion || "")
    const [telefono, setTelefono] = useState(user.telefono || "")
    const [sitioWeb, setSitioWeb] = useState(user.sitioWeb || "")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulación de actualización
        setTimeout(() => {
            const usuarioActualizado: User = {
                ...user,
                name,
                email,
                bio,
                ubicacion,
                telefono,
                sitioWeb,
            }

            updateUser(usuarioActualizado)
            setIsEditing(false)
            setIsLoading(false)

            toast.success("Profile updated successfully")
        }, 1000)
    }

    const handleCancel = () => {
        setName(user.name)
        setEmail(user.email)
        setBio(user.bio || "")
        setUbicacion(user.ubicacion || "")
        setTelefono(user.telefono || "")
        setSitioWeb(user.sitioWeb || "")
        setIsEditing(false)
    }

    const handleAvatarChange = () => {
        // Simulación de cambio de avatar
        toast.info(
            "Function in development"
        )
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Tarjeta de perfil principal */}
            <Card className="md:col-span-1">
                <CardHeader className="text-center">
                    <div className="relative mx-auto">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="outline"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                            onClick={handleAvatarChange}
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>
                    <div>
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {formatDate(user.fechaRegistro || new Date().toISOString())}</span>
                    </div>

                    {user.ubicacion && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{user.ubicacion}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Active User</Badge>
                        {user.verificado && <Badge variant="default">Verified</Badge>}
                    </div>

                    {user.bio && (
                        <div>
                            <p className="text-sm text-muted-foreground">{user.bio}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Formulario de información */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal information and contact details</CardDescription>
                        </div>
                        {!isEditing && (
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <Edit className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing || isLoading}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing || isLoading}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Biography</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us a little about yourself..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                disabled={!isEditing || isLoading}
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ubicacion">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="ubicacion"
                                        placeholder="City, Country"
                                        value={ubicacion}
                                        onChange={(e) => setUbicacion(e.target.value)}
                                        disabled={!isEditing || isLoading}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefono">Phone</Label>
                                <Input
                                    id="telefono"
                                    type="tel"
                                    placeholder="+1 234 567 8900"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    disabled={!isEditing || isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sitioWeb">Website</Label>
                            <Input
                                id="sitioWeb"
                                type="url"
                                placeholder="https://tusitio.com"
                                value={sitioWeb}
                                onChange={(e) => setSitioWeb(e.target.value)}
                                disabled={!isEditing || isLoading}
                            />
                        </div>

                        {isEditing && (
                            <div className="flex gap-4">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save changes"}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
