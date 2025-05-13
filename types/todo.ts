export type Priority = "high" | "normal" | "low";
export type Category = "personal" | "work" | "study" | "home";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  dueDate: string | null;
  priority: Priority;
  category: Category;
  user_id?: string;
}
