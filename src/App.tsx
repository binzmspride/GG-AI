/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, CheckCircle, Circle, ListTodo, Calendar, Filter } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = "all" | "active" | "completed";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("vibrant-tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    localStorage.setItem("vibrant-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setInputValue("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-neutral-200 mb-4"
          >
            <ListTodo className="w-6 h-6 text-neutral-900" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-neutral-900 mb-2"
          >
            Tasks
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500"
          >
            Stay organized and focused on what matters.
          </motion.p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-neutral-900" },
            { label: "Active", value: stats.active, color: "text-neutral-500" },
            { label: "Done", value: stats.completed, color: "text-neutral-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm text-center"
            >
              <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs uppercase tracking-wider font-medium text-neutral-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={addTask} className="relative mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-white border border-neutral-200 rounded-2xl py-4 pl-6 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex gap-2">
            {(["all", "active", "completed"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === f 
                    ? "bg-neutral-900 text-white" 
                    : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center text-neutral-400 text-sm">
            <Filter className="w-4 h-4 mr-1.5" />
            <span>Filter</span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all ${
                    task.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-neutral-900" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                    <span className={`text-neutral-900 truncate ${task.completed ? "line-through text-neutral-400" : ""}`}>
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="ml-4 p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-3xl border border-dashed border-neutral-200"
              >
                <div className="inline-flex items-center justify-center p-4 bg-neutral-50 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-neutral-300" />
                </div>
                <p className="text-neutral-400 font-medium">No tasks found</p>
                <p className="text-neutral-300 text-sm mt-1">Time to add something new!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <footer className="mt-12 text-center text-neutral-400 text-xs uppercase tracking-widest font-medium">
          Vibrant Task Manager &copy; 2026
        </footer>
      </div>
    </div>
  );
}
