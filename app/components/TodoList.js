import React, { useState, useEffect } from "react";

export default function TodoList({ apiBaseUrl }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      alert("Failed to fetch todos");
    }
    setLoading(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input, description: '', status: 'Pending', dueDate: null })
      });
      if (res.ok) {
        const newTodo = await res.json();
        setTodos(prev => [...prev, newTodo]);
        setInput("");
      }
        fetchTodos();
      }
    } catch {
      alert("Failed to add todo");
    }
    setLoading(false);
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await fetch(`${apiBaseUrl}/api/tasks/${id}`, { method: "DELETE" });
      fetchTodos();
    } catch {
      alert("Failed to delete todo");
    }
    setLoading(false);
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setInput(text);
  };

  const updateTodo = async (e) => {
    e.preventDefault();
    if (!input.trim() || editingId === null) return;
    setLoading(true);
    try {
      await fetch(`${apiBaseUrl}/api/tasks/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input, description: '', status: 'Pending', dueDate: null })
      });
      setEditingId(null);
      setInput("");
      fetchTodos();
    } catch {
      alert("Failed to update todo");
    }
    setLoading(false);
  };

  const toggleComplete = async (id, completed) => {
    setLoading(true);
    try {
      await fetch(`${apiBaseUrl}/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed })
      });
      fetchTodos();
    } catch {
      alert("Failed to update status");
    }
    setLoading(false);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-[#181818] rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">To-Do List</h2>
      <form onSubmit={editingId ? updateTodo : addTodo} className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2 text-black"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500"
            onClick={() => { setEditingId(null); setInput(""); }}
          >
            Cancel
          </button>
        )}
      </form>
      <div className="mb-4 flex gap-2">
        <select
          className="border rounded px-2 py-1 text-black"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <ul className="space-y-2">
        {filteredTodos.map(todo => (
          <li key={todo._id} className="flex items-center gap-2 bg-gray-100 dark:bg-[#232323] rounded px-3 py-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
              className="accent-blue-600"
            />
            <div className="flex-1">
              <div className={`${todo.completed ? "line-through text-gray-400" : ""}`}>{todo.title}</div>
              {todo.description && <div className="text-sm text-gray-500">{todo.description}</div>}
              <div className="flex gap-2 mt-1 text-xs">
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">{todo.status}</span>
                {todo.dueDate && <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
            <button
              className="text-xs text-blue-600 hover:underline"
              onClick={() => startEdit(todo._id, todo.text)}
              disabled={loading}
            >Edit</button>
            <button
              className="text-xs text-red-600 hover:underline"
              onClick={() => deleteTodo(todo._id)}
              disabled={loading}
            >Delete</button>
          </li>
        ))}
      </ul>
      {loading && <div className="mt-4 text-center text-gray-500">Loading...</div>}
    </div>
  );
}