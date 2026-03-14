import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { TaskStatus, Prisma } from "@prisma/client";

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { title, description, status } = req.body;
        const userId = req.userId;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const taskStatus = status ? (status.toUpperCase().replace('-', '_') as TaskStatus) : TaskStatus.TODO;

        const task = await prisma.task.create({
            data: { title, description, status: taskStatus, userId }
        });

        return res.status(201).json({ success: true, message: "Task created successfully", task });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tasks with Search, Filter, and Pagination
export const getTasks = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { search, status, page = '1', limit = '10' } = req.query;

        // 1. Validation for page and limit
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);

        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(400).json({ success: false, message: "Invalid page number. Must be a number >= 1." });
        }

        if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
            return res.status(400).json({ success: false, message: "Invalid limit. Must be a number between 1 and 50." });
        }

        const skip = (pageNum - 1) * limitNum;

        // 2. Build where clause
        const where: Prisma.TaskWhereInput = { userId };

        if (search) {
            where.title = { contains: search as string, mode: 'insensitive' };
        }

        if (status) {
            const statusStr = (status as string).toUpperCase().replace('-', '_');
            if (Object.values(TaskStatus).includes(statusStr as TaskStatus)) {
                where.status = statusStr as TaskStatus;
            }
        }

        // 3. Execution using $transaction for efficiency
        const [tasks, totalTasks] = await prisma.$transaction([
            prisma.task.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            prisma.task.count({ where }),
        ]);

        // 4. Structured response with meta
        return res.status(200).json({
            success: true,
            data: tasks,
            meta: {
                total: totalTasks,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalTasks / limitNum)
            }
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Fetch task without userId filter first to check for existence
        const task = await prisma.task.findUnique({ where: { id: id as string } });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // 🛡️ Authorization Check: Prevents IDOR (Insecure Direct Object Reference) attacks
        // If a user knows a valid Task ID, they still cannot read the data unless they own it.
        if (task.userId !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You do not have permission to access this task" });
        }

        return res.status(200).json({ success: true, task });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const userId = req.userId;

        // Fetch task globally to verify ownership before mutation
        const existing = await prisma.task.findUnique({ where: { id: id as string } });
        
        if (!existing) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // 🛡️ Authorization Check: Ensures a user can only update their own resources
        // This prevents malicious users from modifying data belonging to others via ID tampering.
        if (existing.userId !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You cannot update someone else's task" });
        }

        const taskStatus = status
            ? (status.toUpperCase().replace('-', '_') as TaskStatus)
            : existing.status;

        // Use redundant userId check in the where clause for defense-in-depth
        const task = await prisma.task.update({
            where: { id: id as string, userId: userId as string },
            data: { title, description, status: taskStatus as TaskStatus }
        });

        return res.status(200).json({ success: true, message: "Task updated successfully", task });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const existing = await prisma.task.findUnique({ where: { id: id as string } });
        
        if (!existing) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // 🛡️ Authorization Check: Verifies user has authority to delete this specific resource
        if (existing.userId !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You cannot delete someone else's task" });
        }

        // Redundant filter for safety
        await prisma.task.delete({ where: { id: id as string, userId: userId as string } });

        return res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle task status: TODO → IN_PROGRESS → COMPLETED → TODO
export const toggleTaskStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const task = await prisma.task.findUnique({ where: { id: id as string } });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // 🛡️ Authorization Check: Protects against unauthorized state transitions
        if (task.userId !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You cannot toggle someone else's task status" });
        }

        const statusCycle: Record<TaskStatus, TaskStatus> = {
            [TaskStatus.TODO]: TaskStatus.IN_PROGRESS,
            [TaskStatus.IN_PROGRESS]: TaskStatus.COMPLETED,
            [TaskStatus.COMPLETED]: TaskStatus.TODO,
        };

        const newStatus = statusCycle[task.status];

        const updatedTask = await prisma.task.update({
            where: { id: id as string, userId: userId as string },
            data: { status: newStatus as TaskStatus }
        });

        return res.status(200).json({
            success: true,
            message: `Task moved to ${newStatus}`,
            task: updatedTask
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get task statistics for dashboard
export const getTaskStats = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;

        const stats = await prisma.task.groupBy({
            by: ['status'],
            where: { userId },
            _count: {
                id: true
            }
        });

        const totalTasks = await prisma.task.count({ where: { userId } });

        // Format stats for frontend
        const formattedStats = {
            total: totalTasks,
            todo: stats.find((s: any) => s.status === 'TODO')?._count.id || 0,
            inProgress: stats.find((s: any) => s.status === 'IN_PROGRESS')?._count.id || 0,
            completed: stats.find((s: any) => s.status === 'COMPLETED')?._count.id || 0,
        };

        return res.status(200).json({ success: true, stats: formattedStats });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
