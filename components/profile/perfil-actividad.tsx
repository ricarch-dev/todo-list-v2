"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, Plus, Edit, Trash, Calendar, Clock } from "lucide-react"
import { format, parseISO, isToday, isYesterday, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import type { Todo } from "@/types/todo"

interface PerfilActividadProps {
    todos: Todo[]
}

interface ActividadItem {
    id: string
    tipo: "creada" | "completada" | "editada" | "eliminada"
    tarea: string
    fecha: string
    categoria: string
    prioridad: string
}

export default function PerfilActividad({ todos }: PerfilActividadProps) {
    const actividades = useMemo(() => {
        const items: ActividadItem[] = []

        // Generar actividades basadas en las tareas
        todos.forEach((todo) => {
            // Actividad de creación
            items.push({
                id: `${todo.id}-creada`,
                tipo: "creada",
                tarea: todo.title,
                fecha: todo.created_at,
                categoria: todo.category,
                prioridad: todo.priority,
            })

            // Actividad de completación (si está completada)
            if (todo.completed) {
                // Simular fecha de completación (un poco después de la creación)
                const fechaCompletacion = new Date(todo.created_at)
                fechaCompletacion.setHours(fechaCompletacion.getHours() + Math.random() * 48)

                items.push({
                    id: `${todo.id}-completada`,
                    tipo: "completada",
                    tarea: todo.title,
                    fecha: fechaCompletacion.toISOString(),
                    categoria: todo.category,
                    prioridad: todo.priority,
                })
            }
        })

        // Ordenar por fecha (más reciente primero)
        return items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    }, [todos])

    const getIconoActividad = (tipo: ActividadItem["tipo"]) => {
        switch (tipo) {
            case "creada":
                return <Plus className="h-4 w-4 text-blue-600" />
            case "completada":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "editada":
                return <Edit className="h-4 w-4 text-orange-600" />
            case "eliminada":
                return <Trash className="h-4 w-4 text-red-600" />
        }
    }

    const getColorActividad = (tipo: ActividadItem["tipo"]) => {
        switch (tipo) {
            case "creada":
                return "bg-blue-50 border-blue-200"
            case "completada":
                return "bg-green-50 border-green-200"
            case "editada":
                return "bg-orange-50 border-orange-200"
            case "eliminada":
                return "bg-red-50 border-red-200"
        }
    }

    const getTextoActividad = (actividad: ActividadItem) => {
        switch (actividad.tipo) {
            case "creada":
                return "Creaste la tarea"
            case "completada":
                return "Completaste la tarea"
            case "editada":
                return "Editaste la tarea"
            case "eliminada":
                return "Eliminaste la tarea"
        }
    }

    const formatearFecha = (fecha: string) => {
        const fechaObj = parseISO(fecha)

        if (isToday(fechaObj)) {
            return `Hoy a las ${format(fechaObj, "HH:mm")}`
        }

        if (isYesterday(fechaObj)) {
            return `Ayer a las ${format(fechaObj, "HH:mm")}`
        }

        const diasDiferencia = differenceInDays(new Date(), fechaObj)
        if (diasDiferencia <= 7) {
            return format(fechaObj, "EEEE 'a las' HH:mm", { locale: es })
        }

        return format(fechaObj, "d 'de' MMMM 'a las' HH:mm", { locale: es })
    }

    const getCategoriaColor = (categoria: string) => {
        const colores = {
            trabajo: "bg-purple-100 text-purple-800",
            personal: "bg-yellow-100 text-yellow-800",
            estudio: "bg-cyan-100 text-cyan-800",
            hogar: "bg-pink-100 text-pink-800",
        }
        return colores[categoria as keyof typeof colores] || "bg-gray-100 text-gray-800"
    }

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case "alta":
                return "bg-red-100 text-red-800"
            case "normal":
                return "bg-blue-100 text-blue-800"
            case "baja":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // Agrupar actividades por fecha
    const actividadesPorFecha = useMemo(() => {
        const grupos: Record<string, ActividadItem[]> = {}

        actividades.forEach((actividad) => {
            const fecha = parseISO(actividad.fecha)
            let clave: string

            if (isToday(fecha)) {
                clave = "Hoy"
            } else if (isYesterday(fecha)) {
                clave = "Ayer"
            } else {
                const diasDiferencia = differenceInDays(new Date(), fecha)
                if (diasDiferencia <= 7) {
                    clave = format(fecha, "EEEE", { locale: es })
                } else {
                    clave = format(fecha, "d 'de' MMMM", { locale: es })
                }
            }

            if (!grupos[clave]) {
                grupos[clave] = []
            }
            grupos[clave].push(actividad)
        })

        return grupos
    }, [actividades])

    return (
        <div className="space-y-6">
            {/* Resumen de actividad */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tareas Creadas</CardTitle>
                        <Plus className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {actividades.filter((a) => a.tipo === "creada").length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {actividades.filter((a) => a.tipo === "completada").length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Actividad Hoy</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{actividadesPorFecha["Hoy"]?.length || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                        <Clock className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {
                                actividades.filter((a) => {
                                    const fecha = parseISO(a.fecha)
                                    return differenceInDays(new Date(), fecha) <= 7
                                }).length
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline de actividades */}
            <Card>
                <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Tu historial de actividades en las tareas</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96">
                        <div className="space-y-6">
                            {Object.entries(actividadesPorFecha).map(([fecha, actividadesDia]) => (
                                <div key={fecha}>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-3 sticky top-0 bg-background">{fecha}</h3>
                                    <div className="space-y-3">
                                        {actividadesDia.map((actividad) => (
                                            <div
                                                key={actividad.id}
                                                className={`flex items-start gap-3 p-3 rounded-lg border ${getColorActividad(actividad.tipo)}`}
                                            >
                                                <div className="mt-0.5">{getIconoActividad(actividad.tipo)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">
                                                                {getTextoActividad(actividad)} &quot;{actividad.tarea}&quot;
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">{formatearFecha(actividad.fecha)}</p>
                                                        </div>
                                                        <div className="flex gap-1 flex-shrink-0">
                                                            <Badge variant="secondary" className={getCategoriaColor(actividad.categoria)}>
                                                                {actividad.categoria}
                                                            </Badge>
                                                            <Badge variant="secondary" className={getPrioridadColor(actividad.prioridad)}>
                                                                {actividad.prioridad}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {actividades.length === 0 && (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No hay actividad reciente</p>
                                    <p className="text-sm text-muted-foreground">Crea tu primera tarea para ver tu actividad aquí</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
