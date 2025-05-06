'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('Pending');
  const [newDueDate, setNewDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null); // { id, title, description, status, dueDate }
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const API_URL = 'http://localhost:9000/api/tasks'; // Direct backend server connection

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:9000/api/tasks');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Fetch error:', error);
        console.error("Failed to fetch tasks:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, description: newTaskDescription, status: newTaskStatus, dueDate: newDueDate || null }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const addedTask = await res.json();
      setTasks([addedTask, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskStatus('Pending');
      setNewDueDate('');
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (id, currentCompletedStatus, currentTitle, currentDescription, currentStatus, currentDueDate) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: currentTitle, 
          description: currentDescription, 
          completed: !currentCompletedStatus, 
          status: !currentCompletedStatus ? 'Completed' : (currentStatus === 'Completed' ? 'Pending' : currentStatus), // If uncompleting, revert to previous status or Pending
          dueDate: currentDueDate
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const updatedTask = await res.json();
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Start editing a task
  const handleEditTask = (task) => {
    setEditingTask({ 
      id: task._id, 
      title: task.title, 
      description: task.description || '', 
      status: task.status || 'Pending', 
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '' 
    });
  };

  // Save edited task
  const handleSaveEdit = async () => {
    if (!editingTask || !editingTask.title.trim()) return;
    try {
      const taskToUpdate = tasks.find(t => t._id === editingTask.id);
      const res = await fetch(`${API_URL}/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editingTask.title, 
          description: editingTask.description, 
          status: editingTask.status, 
          dueDate: editingTask.dueDate || null, 
          completed: editingTask.status === 'Completed' // Infer completed from status
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const updatedTask = await res.json();
      setTasks(tasks.map(task => task._id === editingTask.id ? updatedTask : task));
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <div className="container mx-auto p-4 max-w-2xl font-[family-name:var(--font-geist-sans)]">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">To-Do List</h1>
      </header>

      <form onSubmit={handleAddTask} className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="mb-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task Title"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task Description (Optional)"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 h-24 resize-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              id="taskStatus"
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date (Optional)</label>
            <input
              type="date"
              id="dueDate"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out">
          Add Task
        </button>
      </form>

      {editingTask && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <h2 class="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Edit Task</h2>
          <input
            type="text"
            value={editingTask.title}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200"
          />
          <textarea
            value={editingTask.description}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            placeholder="Task Description"
            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 h-24 resize-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="editTaskStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                id="editTaskStatus"
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="editDueDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input
                type="date"
                id="editDueDate"
                value={editingTask.dueDate}
                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSaveEdit} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out">
              Save Changes
            </button>
            <button onClick={() => setEditingTask(null)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-center gap-4">
        <button onClick={() => setFilter('all')} className={`py-2 px-4 rounded-md font-medium ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>All</button>
        <button onClick={() => setFilter('active')} className={`py-2 px-4 rounded-md font-medium ${filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Active</button>
        <button onClick={() => setFilter('completed')} className={`py-2 px-4 rounded-md font-medium ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Completed</button>
      </div>

      {filteredTasks.length > 0 ? (
        <ul className="space-y-4">
          {filteredTasks.map(task => (
            <li key={task._id} className={`p-5 bg-white dark:bg-gray-800 shadow-md rounded-lg flex items-start justify-between transition-all duration-300 ease-in-out ${task.completed ? 'opacity-60' : ''}`}> {/* Changed items-center to items-start for better layout with more info */}
              <div onClick={() => handleToggleComplete(task._id, task.completed, task.title, task.description, task.status, task.dueDate)} className="cursor-pointer flex-grow">
                <h3 className={`text-xl font-semibold text-gray-800 dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
                {task.description && <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${task.completed ? 'line-through' : ''}`}>{task.description}</p>}
                <div class="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <p><span class="font-medium">Status:</span> {task.status}</p>
                  {task.dueDate && <p><span class="font-medium">Due:</span> {new Date(task.dueDate).toLocaleDateString()}</p>}
                  <p><span class="font-medium">Created:</span> {new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 sm:gap-3 ml-4 items-end sm:items-center"> {/* Adjusted for better responsiveness */}
                {!task.completed && task.status !== 'Completed' && (
                    <button onClick={() => handleEditTask(task)} className="text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 font-medium py-1 px-3 rounded-md transition duration-150">
                        Edit
                    </button>
                )}
                <button onClick={() => handleDeleteTask(task._id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium py-1 px-3 rounded-md transition duration-150">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">No tasks yet. Add one above!</p>
      )}

      <footer className="text-center mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">To-Do List App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
