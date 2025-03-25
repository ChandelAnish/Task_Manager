"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import TaskCard from "@/component/TaskCard";
import { getTasks, createTask, updateTask, deleteTask, SerializedTask } from "@/lib/actions";

export default function TasksPage() {
  const [tasks, setTasks] = useState<SerializedTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<SerializedTask | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const result = await getTasks();
      if (result.success) {
        // console.log(result.tasks)
        setTasks(result.tasks as SerializedTask[]);
      }
    };
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = editingTask
      ? await updateTask(editingTask.id as string, formData)
      : await createTask(formData);

    if (result.success) {
      setIsModalOpen(false);
      setEditingTask(null);

      // Refresh tasks
      const tasksResult = await getTasks();
      if (tasksResult.success) {
        setTasks(tasksResult.tasks as SerializedTask[]);
      }
    } else {
      alert(result.error);
    }
  };

  const handleEdit = (task: SerializedTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTask(id);
    if (!result.success) {
      alert(result.error);
    }else{
      setTasks(prev => prev.filter(item => item.id != id))
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-500">Task Manager</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="bg-cyan-500 text-white rounded-full p-2 hover:bg-cyan-600"
          >
            <Plus size={24} />
          </motion.button>
        </div>

        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task.id as string}
              task={task}
              onEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </AnimatePresence>

        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-2xl mb-4 text-cyan-500">
                {editingTask ? "Edit Task" : "Create New Task"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  defaultValue={editingTask?.title || ""}
                  placeholder="Task Title"
                  required
                  maxLength={100}
                  className="w-full bg-gray-700 text-white border border-cyan-500/30 rounded p-2"
                />
                <textarea
                  name="description"
                  defaultValue={editingTask?.description || ""}
                  placeholder="Description (optional)"
                  maxLength={500}
                  className="w-full bg-gray-700 text-white border border-cyan-500/30 rounded p-2"
                />
                <select
                  name="priority"
                  defaultValue={editingTask?.priority || "medium"}
                  className="w-full bg-gray-700 text-white border border-cyan-500/30 rounded p-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {editingTask && (
                  <select
                    name="status"
                    defaultValue={editingTask.status}
                    className="w-full bg-gray-700 text-white border border-cyan-500/30 rounded p-2"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
                <input
                  type="date"
                  name="dueDate"
                  defaultValue={
                    editingTask?.dueDate
                      ? new Date(editingTask.dueDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  className="w-full bg-gray-700 text-white border border-cyan-500/30 rounded p-2"
                />
                <input
                  type="text"
                  name="tags"
                  defaultValue={editingTask?.tags?.join(", ") || ""}
                  placeholder="Tags (comma-separated)"
                  className="w-full bg-gray-700 text-white border border-cyan-500/30 rounded p-2"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-700 text-white rounded px-4 py-2 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-500 text-white rounded px-4 py-2 hover:bg-cyan-600"
                  >
                    {editingTask ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
