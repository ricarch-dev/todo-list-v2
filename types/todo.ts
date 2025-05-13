export type Prioridad = "alta" | "normal" | "baja";
export type Categoria = "personal" | "trabajo" | "estudio" | "hogar";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate: string | null;
  prioridad: Prioridad;
  categoria: Categoria;
}
