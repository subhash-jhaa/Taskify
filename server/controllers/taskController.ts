import { Request, Response } from "express";
import taskModel from "../models/taskModel.js";

// Create a new task
export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, status, userId } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const task = new taskModel({
            title,
            description,
            status,
            user: userId
        });

        await task.save();
        res.status(201).json({ success: true, message: "Task created successfully", task });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tasks for the logged-in user (with Search, Filter, and Pagination)
export const getTasks = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const { search, status, page = 1, limit = 10 } = req.query;

        const query: any = { user: userId };

        // Search by title (regex)
        if (search) {
            query.title = { $regex: search as string, $options: "i" };
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const tasks = await taskModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalTasks = await taskModel.countDocuments(query);

        res.status(200).json({
            success: true,
            tasks,
            pagination: {
                total: totalTasks,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(totalTasks / limitNum)
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const task = await taskModel.findOne({ _id: id, user: userId });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, task });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, title, description, status } = req.body;

        const task = await taskModel.findOneAndUpdate(
            { _id: id, user: userId },
            { title, description, status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task updated successfully", task });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const task = await taskModel.findOneAndDelete({ _id: id, user: userId });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle task status
export const toggleTaskStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const task = await taskModel.findOne({ _id: id, user: userId });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Cycle through statuses: todo -> in-progress -> completed -> todo
        const statusMap: Record<string, "todo" | "in-progress" | "completed"> = {
            "todo": "in-progress",
            "in-progress": "completed",
            "completed": "todo"
        };

        task.status = statusMap[task.status] || "todo";
        await task.save();

        res.status(200).json({ success: true, message: `Task moved to ${task.status}`, task });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

