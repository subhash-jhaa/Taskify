'use client';

import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskForm from '@/components/tasks/TaskForm';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Loader2 } from 'lucide-react';
import { Task } from '@/types/task';

export default function EditTaskPage() {
    const { isAuthorized, isLoading: authLoading } = useProtectedRoute();
    const router = useRouter();
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [isLargeLoading, setIsLargeLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthorized && id) {
            fetchTask();
        }
    }, [isAuthorized, id]);

    const fetchTask = async () => {
        try {
            const { data } = await api.get(`/tasks/${id}`);
            if (data.success) {
                setTask(data.task);
            }
        } catch (error: any) {
            toast.error('Failed to fetch task details');
            router.push('/tasks');
        } finally {
            setIsLargeLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await api.patch(`/tasks/${id}`, data);
            if (response.data.success) {
                toast.success('Task updated successfully');
                router.push('/tasks');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update task');
            setIsSubmitting(false);
        }
    };

    if (authLoading || isLargeLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!task) return null;

    return (
        <DashboardLayout>
            <div className="max-w-xl mx-auto py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-3xl border border-border/50 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <Edit2 className="text-primary w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold gradient-text">Edit Task</h1>
                            <p className="text-muted-foreground mt-1">Modify your task details</p>
                        </div>
                    </div>

                    <TaskForm
                        initialData={task}
                        onSubmit={handleSubmit}
                        onCancel={() => router.back()}
                        isSubmitting={isSubmitting}
                    />
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
