import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Todo } from "./db/todoDb";

import { addTodo, getTodos, deleteTodo, setTodoDone } from "./db/todoRepo";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const load = async () => {
      const items = await getTodos();
      setTodos(items);
    };
    load();
  }, []);

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    await addTodo(trimmed);
    setTodos(await getTodos());
    setTitle("");
  };

  const handleToggleDone = async (todo: Todo) => {
    if (!todo.id) return;
    await setTodoDone(todo.id, !todo.done);
    setTodos(await getTodos());
  };

  const handleDeleteTodo = async (todo: Todo) => {
    if (!todo.id) return;
    await deleteTodo(todo.id);
    setTodos(await getTodos());
  };

  return (
    <>
      <div>
        <h1>To Do</h1>
        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            placeholder="Nowe zadanie..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="todo-input"
          />
          <button className="submit">Dodaj</button>
        </form>

        <ul className="todo-list">
          {todos.length === 0 && <li>Brak zadań. Dodaj pierwsze 🙂</li>}

          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <label className="todo-label">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggleDone(todo)}
                />
                <span className={todo.done ? "todo-text-done" : "todo-text"}>
                  {todo.title}
                </span>
                <span className="">
                  {new Date(todo.createdAt).toLocaleString("pl-PL")}
                </span>
              </label>

              <button
                className="delete-btn"
                onClick={() => handleDeleteTodo(todo)}
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
