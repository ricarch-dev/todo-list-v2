import { supabase } from "./supabase";

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  user_id: string;
};

export async function getTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Todo[];
}

export async function createTodo(title: string, description?: string) {
  const { data, error } = await supabase
    .from("todos")
    .insert([
      {
        title,
        description,
        completed: false,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Todo;
}

export async function updateTodo(id: string, updates: Partial<Todo>) {
  const { data, error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Todo;
}

export async function deleteTodo(id: string) {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function toggleTodoStatus(id: string, completed: boolean) {
  const { data, error } = await supabase
    .from("todos")
    .update({ completed })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Todo;
}
