"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Target, TrendingUp, Award, BarChart3, Zap } from "lucide-react"
import type { Todo } from "@/types/todo"

interface PerfilEstadisticasProps {
    todos: Todo[]
}

export default function PerfilEstadisticas({ todos }: PerfilEstadisticasProps) {
    const estadisticas = useMemo(() => {
        const totalTareas = todos.length
        const tareasCompletadas = todos.filter((todo) => todo.completed).length
        const tareasPendientes = totalTareas - tareasCompletadas
        const porcentajeCompletado = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0

        // Tareas por prioridad
        const tareasAlta = todos.filter((todo) => todo.priority === "high").length
        const tareasNormal = todos.filter((todo) => todo.priority === "normal").length
        const tareasBaja = todos.filter((todo) => todo.priority === "low").length

        // Tareas por categoría
        const categorias = todos.reduce(
            (acc, todo) => {
                acc[todo.category] = (acc[todo.category] || 0) + 1
                return acc
            },
            {} as Record<string, number>,
        )

        // Tareas de esta semana
        const inicioSemana = new Date()
        inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay())
        inicioSemana.setHours(0, 0, 0, 0)

        const tareasEstaSemana = todos.filter((todo) => {
            const fechaCreacion = new Date(todo.created_at)
            return fechaCreacion >= inicioSemana
        }).length

        // Racha de días consecutivos (simulada)
        const rachaActual = Math.floor(Math.random() * 15) + 1

        // Tareas vencidas
        const tareasVencidas = todos.filter((todo) => {
            if (!todo.dueDate || todo.completed) return false
            return new Date(todo.dueDate) < new Date()
        }).length

        return {
            totalTareas,
            tareasCompletadas,
            tareasPendientes,
            porcentajeCompletado,
            tareasAlta,
            tareasNormal,
            tareasBaja,
            categorias,
            tareasEstaSemana,
            rachaActual,
            tareasVencidas,
        }
    }, [todos])

    const getCategoriaColor = (categoria: string) => {
        const colores = {
            trabajo: "bg-purple-100 text-purple-800",
            personal: "bg-yellow-100 text-yellow-800",
            estudio: "bg-cyan-100 text-cyan-800",
            hogar: "bg-pink-100 text-pink-800",
        }
        return colores[categoria as keyof typeof colores] || "bg-gray-100 text-gray-800"
    }

    const getNivelProductividad = () => {
        if (estadisticas.porcentajeCompletado >= 80) return { nivel: "Excelente", color: "text-green-600", icon: Award }
        if (estadisticas.porcentajeCompletado >= 60) return { nivel: "Bueno", color: "text-blue-600", icon: TrendingUp }
        if (estadisticas.porcentajeCompletado >= 40) return { nivel: "Regular", color: "text-yellow-600", icon: BarChart3 }
        return { nivel: "Necesita mejorar", color: "text-red-600", icon: Target }
    }

    const productividad = getNivelProductividad()
    const IconProductividad = productividad.icon

    return (
        <div className="space-y-6">
            {/* Resumen general */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Tareas</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{estadisticas.totalTareas}</div>
                        <p className="text-xs text-muted-foreground">Tareas creadas en total</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{estadisticas.tareasCompletadas}</div>
                        <p className="text-xs text-muted-foreground">{estadisticas.porcentajeCompletado}% del total</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{estadisticas.tareasPendientes}</div>
                        <p className="text-xs text-muted-foreground">Por completar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
                        <Zap className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{estadisticas.rachaActual}</div>
                        <p className="text-xs text-muted-foreground">días consecutivos</p>
                    </CardContent>
                </Card>
            </div>

            {/* Progreso y nivel de productividad */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Progreso General</CardTitle>
                        <CardDescription>Tu progreso en la completación de tareas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Progreso de completación</span>
                                <span className="font-medium">{estadisticas.porcentajeCompletado}%</span>
                            </div>
                            <Progress value={estadisticas.porcentajeCompletado} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                <span>Completadas: {estadisticas.tareasCompletadas}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                                <span>Pendientes: {estadisticas.tareasPendientes}</span>
                            </div>
                        </div>

                        {estadisticas.tareasVencidas > 0 && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <span>Vencidas: {estadisticas.tareasVencidas}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Nivel de Productividad</CardTitle>
                        <CardDescription>Basado en tu tasa de completación</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <IconProductividad className={`h-8 w-8 ${productividad.color}`} />
                            <div>
                                <p className={`text-lg font-semibold ${productividad.color}`}>{productividad.nivel}</p>
                                <p className="text-sm text-muted-foreground">
                                    {estadisticas.porcentajeCompletado}% de tareas completadas
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Esta semana</span>
                                <span className="font-medium">{estadisticas.tareasEstaSemana} tareas nuevas</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>Racha actual</span>
                                <span className="font-medium">{estadisticas.rachaActual} días</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Distribución por prioridad y categoría */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Tareas por Prioridad</CardTitle>
                        <CardDescription>Distribución de tus tareas según su prioridad</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm">Alta prioridad</span>
                                </div>
                                <span className="text-sm font-medium">{estadisticas.tareasAlta}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">Prioridad normal</span>
                                </div>
                                <span className="text-sm font-medium">{estadisticas.tareasNormal}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm">Baja prioridad</span>
                                </div>
                                <span className="text-sm font-medium">{estadisticas.tareasBaja}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tareas por Categoría</CardTitle>
                        <CardDescription>Cómo distribuyes tu tiempo entre categorías</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(estadisticas.categorias).map(([categoria, cantidad]) => (
                                <div key={categoria} className="flex items-center justify-between">
                                    <Badge variant="secondary" className={getCategoriaColor(categoria)}>
                                        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                                    </Badge>
                                    <span className="text-sm font-medium">{cantidad} tareas</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Logros y reconocimientos */}
            <Card>
                <CardHeader>
                    <CardTitle>Logros</CardTitle>
                    <CardDescription>Reconocimientos por tu productividad</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <Award className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="font-medium text-green-800">Primera Tarea</p>
                                <p className="text-sm text-green-600">Completaste tu primera tarea</p>
                            </div>
                        </div>

                        {estadisticas.tareasCompletadas >= 10 && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                                <Target className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="font-medium text-blue-800">Productivo</p>
                                    <p className="text-sm text-blue-600">10+ tareas completadas</p>
                                </div>
                            </div>
                        )}

                        {estadisticas.rachaActual >= 7 && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                <Zap className="h-8 w-8 text-yellow-600" />
                                <div>
                                    <p className="font-medium text-yellow-800">Racha Semanal</p>
                                    <p className="text-sm text-yellow-600">7+ días consecutivos</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
