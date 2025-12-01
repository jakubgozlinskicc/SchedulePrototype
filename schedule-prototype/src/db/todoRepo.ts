import { db } from "./todoDb";
import type { Todo } from "./todoDb";

// CREATE
export async function addTodo(title: string): Promise<number> {
  const id = await db.todos.add({
    title,
    done: false,
    createdAt: new Date().toISOString(),
  });

  return id;
}

export async function getTodos(): Promise<Todo[]> {
  return await db.todos.orderBy("id").reverse().toArray();
}

export async function setTodoDone(id: number, done: boolean): Promise<void> {
  await db.todos.update(id, { done });
}

export async function deleteTodo(id: number): Promise<void> {
  await db.todos.delete(id);
}
