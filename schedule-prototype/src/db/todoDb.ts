import Dexie from "dexie";
import type { Table } from "dexie";

export interface Todo {
  id?: number; // id będzie nadawane automatycznie
  title: string;
  done: boolean;
  createdAt: string; // ISO string z datą
}

export class TodoDB extends Dexie {
  // Table<TypRekordu, TypKlucza>
  todos!: Table<Todo, number>;

  constructor() {
    super("TodoDB");

    this.version(1).stores({
      // ++id = auto-increment
      // indeksy: title, done, createdAt
      todos: "++id, title, done, createdAt",
    });
  }
}

// Pojedyncza instancja bazy
export const db = new TodoDB();
