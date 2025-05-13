"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format, parseISO, isPast, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { PlusCircle, Calendar, Trash2, Edit, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { Todo, Prioridad, Categoria } from "@/types/todo"

interface TodoListProps {
    filter: "todos" | "pendientes" | "completadas" | "alta"
}

export default function TodoList({ filter }: TodoListProps) {
    const [todos, setTodos] = useState<Todo[]>([])
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [todoTitle, setTodoTitle] = useState("")
    const [todoDescription, setTodoDescription] = useState("")
    const [todoDueDate, setTodoDueDate] = useState("")
    const [todoPrioridad, setTodoPrioridad] = useState<Prioridad>("normal")
    const [todoCategoria, setTodoCategoria] = useState<Categoria>("personal")
    const [isEditing, setIsEditing] = useState(false)
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null)

    // Cargar todos del localStorage
    useEffect(() => {
        const storedTodos = localStorage.getItem("todos")
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos))
        }
    }, [])

    // Guardar todos en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos))
    }, [todos])

    // Filtrar todos según el filtro seleccionado
    useEffect(() => {
        switch (filter) {
            case "pendientes":
                setFilteredTodos(todos.filter((todo) => !todo.completed))
                break
            case "completadas":
                setFilteredTodos(todos.filter((todo) => todo.completed))
                break
            case "alta":
                setFilteredTodos(todos.filter((todo) => todo.prioridad === "alta"))
                break
            default:
                setFilteredTodos(todos)
        }
    }, [todos, filter])

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault()
        if (newTodo.trim() === "") return

        const todo: Todo = {
            id: Date.now().toString(),
            title: newTodo,
            description: "",
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: null,
            prioridad: "normal",
            categoria: "personal",
        }

        setTodos([...todos, todo])
        setNewTodo("")
        toast("Tarea creada", {
            description: "La tarea ha sido creada exitosamente",
        })
    }

    const toggleTodo = (id: string) => {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
    }

    const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id))
        toast("Tarea eliminada", {
            description: "La tarea ha sido eliminada exitosamente",
        })
    }

    const handleCreateTodo = () => {
        if (todoTitle.trim() === "") return

        const todo: Todo = {
            id: isEditing && editingTodoId ? editingTodoId : Date.now().toString(),
            title: todoTitle,
            description: todoDescription,
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: todoDueDate ? todoDueDate : null,
            prioridad: todoPrioridad,
            categoria: todoCategoria,
        }

        if (isEditing && editingTodoId) {
            setTodos(todos.map((t) => (t.id === editingTodoId ? todo : t)))
            toast("Tarea actualizada", {
                description: "La tarea ha sido actualizada exitosamente",
            })
        } else {
            setTodos([...todos, todo])
            toast("Tarea creada", {
                description: "La tarea ha sido creada exitosamente",
            })
        }

        resetForm()
        setIsDialogOpen(false)
    }

    const editTodo = (todo: Todo) => {
        setIsEditing(true)
        setEditingTodoId(todo.id)
        setTodoTitle(todo.title)
        setTodoDescription(todo.description || "")
        setTodoDueDate(todo.dueDate || "")
        setTodoPrioridad(todo.prioridad)
        setTodoCategoria(todo.categoria)
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setTodoTitle("")
        setTodoDescription("")
        setTodoDueDate("")
        setTodoPrioridad("normal")
        setTodoCategoria("personal")
        setIsEditing(false)
        setEditingTodoId(null)
    }

    const getPrioridadColor = (prioridad: Prioridad) => {
        switch (prioridad) {
            case "alta":
                return "bg-red-100 text-red-800 hover:bg-red-200"
            case "normal":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "baja":
                return "bg-green-100 text-green-800 hover:bg-green-200"
        }
    }

    const getCategoriaColor = (categoria: Categoria) => {
        switch (categoria) {
            case "trabajo":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200"
            case "personal":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            case "estudio":
                return "bg-cyan-100 text-cyan-800 hover:bg-cyan-200"
            case "hogar":
                return "bg-pink-100 text-pink-800 hover:bg-pink-200"
        }
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Mis Tareas</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => {
                                    resetForm()
                                    setIsDialogOpen(true)
                                }}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nueva Tarea
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEditing ? "Editar Tarea" : "Crear Nueva Tarea"}</DialogTitle>
                                <DialogDescription>
                                    {isEditing ? "Actualiza los detalles de tu tarea." : "Añade los detalles de tu nueva tarea."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título</Label>
                                    <Input
                                        id="title"
                                        placeholder="Título de la tarea"
                                        value={todoTitle}
                                        onChange={(e) => setTodoTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descripción (opcional)</Label>
                                    <Input
                                        id="description"
                                        placeholder="Descripción de la tarea"
                                        value={todoDescription}
                                        onChange={(e) => setTodoDescription(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Fecha de vencimiento (opcional)</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={todoDueDate}
                                        onChange={(e) => setTodoDueDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="prioridad">Prioridad</Label>
                                        <Select value={todoPrioridad} onValueChange={(value) => setTodoPrioridad(value as Prioridad)}>
                                            <SelectTrigger id="prioridad">
                                                <SelectValue placeholder="Seleccionar prioridad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="alta">Alta</SelectItem>
                                                <SelectItem value="normal">Normal</SelectItem>
                                                <SelectItem value="baja">Baja</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="categoria">Categoría</Label>
                                        <Select value={todoCategoria} onValueChange={(value) => setTodoCategoria(value as Categoria)}>
                                            <SelectTrigger id="categoria">
                                                <SelectValue placeholder="Seleccionar categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="personal">Personal</SelectItem>
                                                <SelectItem value="trabajo">Trabajo</SelectItem>
                                                <SelectItem value="estudio">Estudio</SelectItem>
                                                <SelectItem value="hogar">Hogar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        resetForm()
                                        setIsDialogOpen(false)
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleCreateTodo}>{isEditing ? "Actualizar" : "Crear"}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <CardDescription>Gestiona tus tareas diarias</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={addTodo} className="flex items-center space-x-2 mb-4">
                    <Input
                        type="text"
                        placeholder="Añadir tarea rápida..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon">
                        <PlusCircle className="h-5 w-5" />
                        <span className="sr-only">Añadir tarea</span>
                    </Button>
                </form>

                <div className="space-y-3">
                    {filteredTodos.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                            No hay tareas {filter === "completadas" ? "completadas" : filter === "pendientes" ? "pendientes" : ""}.
                        </p>
                    ) : (
                        filteredTodos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`group relative rounded-md border p-4 ${todo.completed ? "bg-muted/50" : "bg-background"}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <Checkbox
                                            id={`todo-${todo.id}`}
                                            checked={todo.completed}
                                            onCheckedChange={() => toggleTodo(todo.id)}
                                            className="mt-1"
                                        />
                                        <div>
                                            <label
                                                htmlFor={`todo-${todo.id}`}
                                                className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                                            >
                                                {todo.title}
                                            </label>
                                            {todo.description && (
                                                <p className={`mt-1 text-sm ${todo.completed ? "text-muted-foreground" : "text-gray-500"}`}>
                                                    {todo.description}
                                                </p>
                                            )}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {todo.dueDate && (
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span
                                                            className={
                                                                isPast(parseISO(todo.dueDate)) && !isToday(parseISO(todo.dueDate)) && !todo.completed
                                                                    ? "text-red-600"
                                                                    : ""
                                                            }
                                                        >
                                                            {format(parseISO(todo.dueDate), "d MMM", { locale: es })}
                                                        </span>
                                                    </Badge>
                                                )}
                                                <Badge className={getPrioridadColor(todo.prioridad)}>
                                                    {todo.prioridad.charAt(0).toUpperCase() + todo.prioridad.slice(1)}
                                                </Badge>
                                                <Badge className={getCategoriaColor(todo.categoria)}>
                                                    <Tag className="mr-1 h-3 w-3" />
                                                    {todo.categoria.charAt(0).toUpperCase() + todo.categoria.slice(1)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => editTodo(todo)} className="h-8 w-8">
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Editar tarea</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTodo(todo.id)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Eliminar tarea</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
            {filteredTodos.length > 0 && (
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <p>Total: {filteredTodos.length} tarea(s)</p>
                    <p>
                        {filter === "todos" &&
                            `${todos.filter((t) => t.completed).length} completadas, ${todos.filter((t) => !t.completed).length} pendientes`}
                    </p>
                </CardFooter>
            )}
        </Card>
    )
}
