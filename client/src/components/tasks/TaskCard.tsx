'use client';

import { Task } from '@/types/task';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Trash2, Edit3, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';

interface TaskCardProps {
    task: Task;
    onUpdate?: () => void;
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleStatus = async () => {
        try {
            const { data } = await api.patch(`tasks/${task.id}/toggle`);
            if (data.success) {
                toast.success(`Task marked as ${data.task.status}`);
                onUpdate?.();
            }
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    const deleteTask = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        setIsDeleting(true);
        try {
            const { data } = await api.delete(`tasks/${task.id}`);
            if (data.success) {
                toast.success('Task deleted');
                onUpdate?.();
            }
        } catch (error: any) {
            toast.error('Failed to delete task');
        } finally {
            setIsDeleting(false);
        }
    };

    const statusIcons = {
        TODO: { icon: Circle, color: 'text-muted-foreground', label: 'Todo', bg: 'bg-accent/50' },
        IN_PROGRESS: { icon: Clock, color: 'text-blue-500', label: 'In Progress', bg: 'bg-blue-500/10' },
        COMPLETED: { icon: CheckCircle2, color: 'text-green-500', label: 'Completed', bg: 'bg-green-500/10' },
    };

    const { icon: StatusIcon, color, label, bg } = statusIcons[task.status];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass p-5 rounded-2xl border border-border/40 hover:border-primary/30 transition-all flex flex-col gap-4 group relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <div className="flex items-start justify-between gap-4">
                <button
                    onClick={toggleStatus}
                    className={`p-2 rounded-lg ${bg} transition-transform hover:scale-105 active:scale-95`}
                >
                    <StatusIcon className={`w-5 h-5 ${color}`} />
                </button>

                <div className="flex-1 min-w-0">
                    <h4 className={`font-bold truncate text-lg ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground decoration-primary/50' : ''}`}>
                        {task.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {task.description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        href={`/tasks/edit/${task.id}`}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
                    >
                        <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={deleteTask}
                        className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/20">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${bg} ${color} border border-border/50`}>
                    {label}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                    {new Date(task.createdAt).toLocaleDateString()}
                </span>
            </div>
        </motion.div>
    );
}
