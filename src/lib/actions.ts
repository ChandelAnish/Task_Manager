"use server";

import { revalidatePath } from "next/cache";
// import { redirect } from 'next/navigation';
import dbConnect from "./dbConnect";
import Task, { ITask } from "../models/Tasks";

export interface SerializedTask {
  id: string;
  title: string;
  description?: string | null;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  dueDate: string | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

function serializeTask(task: ITask): SerializedTask {
  return {
    id: String(task._id),
    title: task.title,
    description: task.description ?? null,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    tags: task.tags,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function createTask(formData: FormData) {
  await dbConnect();

  try {
    const task = await Task.create({
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      status: "todo",
      dueDate: formData.get("dueDate")
        ? new Date(formData.get("dueDate") as string)
        : undefined,
      tags: (formData.get("tags") as string)
        ?.split(",")
        .map((tag) => tag.trim()),
    });

    revalidatePath("/");
    return { success: true, task: serializeTask(task) };
  } catch (error) {
    console.error("Create task error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

export async function updateTask(id: string, formData: FormData) {
  await dbConnect();

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      {
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        status: formData.get("status"),
        dueDate: formData.get("dueDate")
          ? new Date(formData.get("dueDate") as string)
          : undefined,
        tags: (formData.get("tags") as string)
          ?.split(",")
          .map((tag) => tag.trim()),
      },
      { new: true }
    );

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    revalidatePath("/");
    return { success: true, task: serializeTask(task) };
  } catch (error) {
    console.error("Update task error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task",
    };
  }
}

export async function deleteTask(id: string) {
  await dbConnect();

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete task error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}

export async function getTasks() {
  await dbConnect();

  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    return {
      success: true,
      tasks: tasks.map(serializeTask),
    };
  } catch (error) {
    console.error("Get tasks error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retrieve tasks",
    };
  }
}
