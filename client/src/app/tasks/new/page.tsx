'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskForm from '@/components/tasks/TaskForm';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

export default function NewTaskPage() {
    const { isAuthorized, isLoading: authLoading } = useProtectedRoute();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (authLoading || !isAuthorized) return null;

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await api.post('/tasks', data);
            if (response.data.success) {
                toast.success('Task created successfully');
                router.push('/tasks');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create task');
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-xl mx-auto py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-3xl border border-border/50 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <PlusCircle className="text-primary w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold gradient-text">New Task</h1>
                            <p className="text-muted-foreground mt-1">Add a new task to your list</p>
                        </div>
                    </div>

                    <TaskForm
                        onSubmit={handleSubmit}
                        onCancel={() => router.back()}
                        isSubmitting={isSubmitting}
                    />
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
