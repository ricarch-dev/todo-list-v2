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
import type { Category, Priority, Todo } from "@/types/todo"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { getCategoryColor } from "@/lib/utils"
import { getPriorityColor } from "@/lib/utils"
import TodoSkeleton from "./todo-skeleton"

interface TodoListProps {
    filter: "todos" | "pending" | "completed" | "high"
}

export default function TodoList({ filter }: TodoListProps) {
    const [todos, setTodos] = useState<Todo[]>([])
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [todoTitle, setTodoTitle] = useState("")
    const [todoDescription, setTodoDescription] = useState("")
    const [todoDueDate, setTodoDueDate] = useState("")
    const [todoPriority, setTodoPriority] = useState<Priority>("normal")
    const [todoCategory, setTodoCategory] = useState<Category>("personal")
    const [isEditing, setIsEditing] = useState(false)
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    // Comprobar si hay un usuario autenticado
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                // Redirigir al login si no hay usuario
                router.push('/login')
                return
            }

            setUser(user)
        }

        checkUser()
    }, [router])

    // Suscribirse a cambios de autenticación
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    setUser(session.user)
                } else if (event === 'SIGNED_OUT') {
                    router.push('/login')
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [router])

    // Cargar todos de Supabase
    useEffect(() => {
        const fetchTodos = async () => {
            if (!user) return

            try {
                setIsLoading(true)
                const { data, error } = await supabase
                    .from('todos')
                    .select('*')
                    .eq('user_id', user.id)

                if (error) {
                    throw error
                }

                if (data) {
                    setTodos(data)
                }
            } catch (error) {
                toast.error('Error loading tasks', {
                    description: 'Please try again ' + error,
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (user) {
            fetchTodos()

            // Suscripción en tiempo real a cambios en los todos para este usuario
            const todosSubscription = supabase
                .channel('todos-changes')
                .on('postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'todos',
                        filter: `user_id=eq.${user.id}`
                    },
                    async () => {
                        const { data } = await supabase
                            .from('todos')
                            .select('*')
                            .eq('user_id', user.id)

                        if (data) {
                            setTodos(data)
                        }
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(todosSubscription)
            }
        }
    }, [user])

    // Filtrar todos según el filtro seleccionado
    useEffect(() => {
        switch (filter) {
            case "pending":
                setFilteredTodos(todos.filter((todo) => !todo.completed))
                break
            case "completed":
                setFilteredTodos(todos.filter((todo) => todo.completed))
                break
            case "high":
                setFilteredTodos(todos.filter((todo) => todo.priority === "high"))
                break
            default:
                setFilteredTodos(todos)
        }
    }, [todos, filter])

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newTodo.trim() === "" || !user) return

        setIsLoading(true)

        try {
            const todo = {
                title: newTodo,
                description: "",
                completed: false,
                created_at: new Date().toISOString(),
                dueDate: null,
                priority: "normal" as Priority,
                category: "personal" as Category,
                user_id: user.id
            }

            const { data, error } = await supabase
                .from('todos')
                .insert(todo)
                .select()

            if (error) {
                throw error
            }

            // Actualizar el estado local inmediatamente
            if (data && data.length > 0) {
                setTodos(prevTodos => [...prevTodos, data[0]])
            }

            setNewTodo("")
            toast.success("Task created", {
                description: "The task has been created successfully",
            })
        } catch (error) {
            console.error('Error adding todo:', error)
            toast.error('Error creating task')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleTodo = async (id: string, completed: boolean) => {
        if (!user) return

        try {
            const { error } = await supabase
                .from('todos')
                .update({ completed: !completed })
                .eq('id', id)
                .eq('user_id', user.id)

            if (error) {
                throw error
            }

            // Actualizar el estado local inmediatamente
            setTodos(prevTodos =>
                prevTodos.map(todo =>
                    todo.id === id ? { ...todo, completed: !completed } : todo
                )
            )
        } catch (error) {
            console.error('Error toggling todo:', error)
            toast.error('Error updating task')
        }
    }

    const deleteTodo = async (id: string) => {
        if (!user) return

        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id)

            if (error) {
                throw error
            }

            // Actualizar el estado local inmediatamente
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))

            toast.success("Task deleted", {
                description: "The task has been deleted successfully",
            })
        } catch (error) {
            console.error('Error deleting todo:', error)
            toast.error('Error deleting task')
        }
    }

    const handleCreateTodo = async () => {
        if (todoTitle.trim() === "" || !user) return

        setIsLoading(true)

        try {
            const todo = {
                title: todoTitle,
                description: todoDescription,
                completed: false,
                created_at: new Date().toISOString(),
                dueDate: todoDueDate ? todoDueDate : null,
                priority: todoPriority,
                category: todoCategory,
                user_id: user.id
            }

            if (isEditing && editingTodoId) {
                const { data, error } = await supabase
                    .from('todos')
                    .update(todo)
                    .eq('id', editingTodoId)
                    .eq('user_id', user.id)
                    .select()

                if (error) {
                    throw error
                }

                // Actualizar el estado local inmediatamente
                if (data && data.length > 0) {
                    setTodos(prevTodos =>
                        prevTodos.map(t =>
                            t.id === editingTodoId ? data[0] : t
                        )
                    )
                }

                toast.success("Task updated", {
                    description: "The task has been updated successfully",
                })
            } else {
                const { data, error } = await supabase
                    .from('todos')
                    .insert(todo)
                    .select()

                if (error) {
                    throw error
                }

                // Actualizar el estado local inmediatamente
                if (data && data.length > 0) {
                    setTodos(prevTodos => [...prevTodos, data[0]])
                }

                toast.success("Task created", {
                    description: "The task has been created successfully",
                })
            }

            resetForm()
            setIsDialogOpen(false)
        } catch (error) {
            console.error('Error creating/updating todo:', error)
            toast.error(isEditing ? 'Error updating task' : 'Error creating task')
        } finally {
            setIsLoading(false)
        }
    }

    const editTodo = (todo: Todo) => {
        setIsEditing(true)
        setEditingTodoId(todo.id)
        setTodoTitle(todo.title)
        setTodoDescription(todo.description || "")
        setTodoDueDate(todo.dueDate || "")
        setTodoPriority(todo.priority)
        setTodoCategory(todo.category)
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setTodoTitle("")
        setTodoDescription("")
        setTodoDueDate("")
        setTodoPriority("normal")
        setTodoCategory("personal")
        setIsEditing(false)
        setEditingTodoId(null)
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>My Tasks</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => {
                                    resetForm()
                                    setIsDialogOpen(true)
                                }}
                                disabled={isLoading || !user}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>
                                <DialogDescription>
                                    {isEditing ? "Edit the details of your task." : "Add the details of your new task."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Title of the task"
                                        value={todoTitle}
                                        onChange={(e) => setTodoTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (optional)</Label>
                                    <Input
                                        id="description"
                                        placeholder="Description of the task"
                                        value={todoDescription}
                                        onChange={(e) => setTodoDescription(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Due Date (optional)</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={todoDueDate}
                                        onChange={(e) => setTodoDueDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="prioridad">Priority</Label>
                                        <Select value={todoPriority} onValueChange={(value) => setTodoPriority(value as Priority)}>
                                            <SelectTrigger id="prioridad">
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="normal">Normal</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="categoria">Category</Label>
                                        <Select value={todoCategory} onValueChange={(value) => setTodoCategory(value as Category)}>
                                            <SelectTrigger id="categoria">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="personal">Personal</SelectItem>
                                                <SelectItem value="work">Work</SelectItem>
                                                <SelectItem value="study">Study</SelectItem>
                                                <SelectItem value="home">Home</SelectItem>
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
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateTodo} disabled={isLoading}>
                                    {isEditing ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <CardDescription>Manage your daily tasks</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={addTodo} className="flex items-center space-x-2 mb-4">
                    <Input
                        type="text"
                        placeholder="Add a quick task..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        className="flex-1"
                        disabled={isLoading || !user}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !user}>
                        <PlusCircle className="h-5 w-5" />
                        <span className="sr-only">Add task</span>
                    </Button>
                </form>

                <div className="space-y-3">
                    {!user ? (
                        <p className="text-center text-muted-foreground py-4">Please login to view your tasks</p>
                    ) : isLoading ? (
                        <TodoSkeleton />
                    ) : filteredTodos.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                            No tasks {filter === "completed" ? "completed" : filter === "pending" ? "pending" : ""}.
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
                                            onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
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
                                                <Badge className={getPriorityColor(todo.priority)}>
                                                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                                </Badge>
                                                <Badge className={getCategoryColor(todo.category)}>
                                                    <Tag className="mr-1 h-3 w-3" />
                                                    {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => editTodo(todo)} className="h-8 w-8" disabled={isLoading}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit task</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTodo(todo.id)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete task</span>
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
                    <p>Total: {filteredTodos.length} task(s)</p>
                    <p>
                        {filter === "todos" &&
                            `${todos.filter((t) => t.completed).length} completed, ${todos.filter((t) => !t.completed).length} pending`}
                    </p>
                </CardFooter>
            )}
        </Card>
    )
}
