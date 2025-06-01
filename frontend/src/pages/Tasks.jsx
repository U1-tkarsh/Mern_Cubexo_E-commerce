import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Tasks({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch {
      alert("Failed to fetch tasks");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await API.post("/tasks", { title: newTitle });
      setNewTitle("");
      fetchTasks();
    } catch {
      alert("Failed to add task");
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await API.put(`/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch {
      alert("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      alert("Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-6 space-y-6 mt-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My To‑Do List</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              onLogout();
            }}
            className="text-sm text-red-600 underline"
          >
            Logout
          </button>
        </div>

        <form className="flex space-x-2" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Add new task"
            className="flex-grow p-2 border rounded-xl"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="bg-green-600 text-white px-4 rounded-xl shadow hover:shadow-lg transition">
            Add
          </button>
        </form>

        <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center p-3 border rounded-xl"
            >
              <div
                className={`flex items-center space-x-3 ${task.completed ? "line-through text-gray-400" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task._id, task.completed)}
                />
                <span>{task.title}</span>
              </div>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-sm text-red-600 underline"
              >
                Delete
              </button>
            </li>
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-gray-500">No tasks yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}