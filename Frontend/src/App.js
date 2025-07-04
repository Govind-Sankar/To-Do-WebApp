import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  const fetchTasks = async (token) => {
    const response = await fetch(
      "https://todobackend-production-74e0.up.railway.app/tasks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log("Fetched tasks:", data);
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  useEffect(() => {
    if (token) fetchTasks(token);
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  const addTask = async (text) => {
    const response = await fetch(
      "https://todobackend-production-74e0.up.railway.app/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, status: "pending", priority: "medium" }),
      }
    );
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  const deleteTask = async (id) => {
    await fetch(
      `https://todobackend-production-74e0.up.railway.app/tasks/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    const response = await fetch(
      `https://todobackend-production-74e0.up.railway.app/tasks/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const updateTaskPriority = async (id, newPriority) => {
    const response = await fetch(
      `https://todobackend-production-74e0.up.railway.app/tasks/${id}/priority`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority: newPriority }),
      }
    );
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  const MainApp = () => (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-black"
      } min-h-screen flex flex-col`}
    >
      <nav className="bg-purple-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <ul className="flex space-x-4">
          <li>
            <button
              className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                darkMode
                  ? "bg-purple-600 text-white hover:bg-purple-100 hover:text-purple-700"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white"
              } shadow-sm`}
            >
              <i className="fas fa-home"></i> Home
            </button>
          </li>
        </ul>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
              darkMode
                ? "bg-purple-600 text-white hover:bg-purple-100 hover:text-purple-700"
                : "bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white"
            } shadow-sm`}
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <i className="fas fa-sun"></i> // Light mode icon
            ) : (
              <i className="fas fa-moon"></i> // Dark mode icon
            )}{" "}
            Switch Theme
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow transition-colors duration-200"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>
      <main
        className={`flex-1 p-8 ${darkMode ? "bg-gray-800" : "bg-purple-200"}`}
      >
        <h1 className="text-4xl font-extrabold text-center mb-8 text-purple-600 drop-shadow">
          To-Do App
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const value = e.target[0].value.trim();
            if (!value) return;
            addTask(value);
            e.target[0].value = "";
          }}
          className="mb-6 flex gap-2 justify-center"
        >
          <input
            type="text"
            maxLength={75}
            className="p-3 border-2 border-purple-300 rounded-lg w-2/3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter a task"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors duration-200"
          >
            <i className="fas fa-plus"></i> Add
          </button>
        </form>
        <div className="mb-6 flex gap-4 justify-center">
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border-2 text-black border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={filterStatus}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border-2 text-black border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={filterPriority}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className={`p-4 ${
                darkMode
                  ? "bg-gray-900 hover:bg-black text-white"
                  : "bg-gray-200 hover:bg-purple-300 text-black"
              } rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition duration-300`}
            >
              <div className="flex-1">
                <span className="text-lg text-orange-800">{task.text}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({task.status}, {task.priority}) •{" "}
                  {new Date(task.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => updateTaskStatus(task._id, task.status)}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors duration-200 ${
                    task.status === "pending"
                      ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                      : "bg-green-400 text-green-900 hover:bg-green-500"
                  }`}
                >
                  <i
                    className={
                      task.status === "pending"
                        ? "fas fa-check"
                        : "fas fa-circle-check"
                    }
                  ></i>{" "}
                  {task.status === "pending" ? "Mark Complete" : "Mark Pending"}
                </button>
                <select
                  value={task.priority}
                  onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                  className="p-2 border-2 text-black border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-full transition-colors duration-200 ml-2"
                  title="Delete Task"
                >
                  <i className="fas fa-trash" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <footer className="bg-purple-500 text-white p-4 mt-auto text-center">
        © 2025 To-Do App
      </footer>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={token ? <MainApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}
