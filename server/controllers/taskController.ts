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

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const where: any = { userId };

        if (search) {
            where.title = { contains: search as string, mode: 'insensitive' };
        }

        if (status) {
            // Accept both "todo", "in-progress" style and "TODO", "IN_PROGRESS" style
            const statusKey = (status as string).toUpperCase().replace('-', '_');
            if (Object.values(TaskStatus).includes(statusKey as TaskStatus)) {
                where.status = statusKey as TaskStatus;
            }
        }

        const [tasks, totalTasks] = await prisma.$transaction([
            prisma.task.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            prisma.task.count({ where }),
        ]);

        return res.status(200).json({
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
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const task = await prisma.task.findFirst({ where: { id: id as string, userId: userId as string } });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
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

        const existing = await prisma.task.findFirst({ where: { id: id as string, userId: userId as string } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const taskStatus = status
            ? (status.toUpperCase().replace('-', '_') as TaskStatus)
            : existing.status;

        const task = await prisma.task.update({
            where: { id: id as string },
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

        const existing = await prisma.task.findFirst({ where: { id: id as string, userId: userId as string } });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        await prisma.task.delete({ where: { id: id as string } });

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

        const task = await prisma.task.findFirst({ where: { id: id as string, userId: userId as string } });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const statusCycle: Record<TaskStatus, TaskStatus> = {
            [TaskStatus.TODO]: TaskStatus.IN_PROGRESS,
            [TaskStatus.IN_PROGRESS]: TaskStatus.COMPLETED,
            [TaskStatus.COMPLETED]: TaskStatus.TODO,
        };

        const newStatus = statusCycle[task.status];

        const updatedTask = await prisma.task.update({
            where: { id: id as string },
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
