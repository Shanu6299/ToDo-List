import React, { useState, useEffect } from "react";
import axiosInstance from "../Client/src/utils/axiosConfig";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/tasks`);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks - please try refreshing");
    }
    setLoading(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/api/tasks`, { 
        title: input, 
        description: description, 
        status: status, 
        dueDate: dueDate || null, 
        completed: status === "Completed" 
      });
      
      if (res.data) {
        setInput("");
        setDescription("");
        setStatus("Pending");
        setDueDate("");
        fetchTodos();
      }
    } catch (err) {
      console.error("Error adding todo:", err);
      alert("Failed to add todo");
    }
    setLoading(false);
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/api/tasks/${id}`);
      const updatedTodos = todos.filter(todo => todo._id !== id);
      setTodos(updatedTodos);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task - changes reverted");
      setTodos(todos);
    }
    setLoading(false);
  };

  const startEdit = (id, todo) => {
    setEditingId(id);
    setInput(todo.title);
    setDescription(todo.description || "");
    setStatus(todo.status || "Pending");
    setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : "");
  };

  const updateTodo = async (e) => {
    e.preventDefault();
    if (!input.trim() || editingId === null) return;
    setLoading(true);
    try {
      await axiosInstance.put(`/api/tasks/${editingId}`, { 
        title: input, 
        description: description, 
        status: status, 
        dueDate: dueDate || null,
        completed: status === "Completed"
      });
      setEditingId(null);
      setInput("");
      setDescription("");
      setStatus("Pending");
      setDueDate("");
      fetchTodos();
    } catch {
      alert("Failed to update todo");
    }
    setLoading(false);
  };

  const toggleComplete = async (id, todo) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/api/tasks/${id}`, {
        title: todo.title,
        description: todo.description || '',
        status: !todo.completed ? 'Completed' : (todo.status === 'Completed' ? 'Pending' : todo.status),
        dueDate: todo.dueDate,
        completed: !todo.completed
      });
      fetchTodos();
    } catch (err) {
      console.error("Error updating status:", err);
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
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">To-Do List</h2>
      <form onSubmit={editingId ? updateTodo : addTodo} className="space-y-3 mb-4">
        <input
          className="w-full border rounded px-3 py-2 text-black"
          placeholder="Task title..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <textarea
          className="w-full border rounded px-3 py-2 text-black"
          placeholder="Task description (optional)..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
          rows="2"
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <select
              className="w-full border rounded px-3 py-2 text-black"
              value={status}
              onChange={e => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex-1">
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full border rounded px-3 py-2 text-black"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500"
              onClick={() => { 
                setEditingId(null); 
                setInput(""); 
                setDescription("");
                setStatus("Pending");
                setDueDate("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
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
              onChange={() => toggleComplete(todo._id, todo)}
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
              onClick={() => startEdit(todo._id, todo)}
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