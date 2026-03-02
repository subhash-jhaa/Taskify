'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Task, TaskStatus } from '@/types/task';
import { Loader2, Save, X, Type, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).nullish(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
    initialData?: Partial<Task>;
    onSubmit: (data: TaskFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function TaskForm({ initialData, onSubmit, onCancel, isSubmitting }: TaskFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            status: initialData?.status || 'TODO',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold ml-1 flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" />
                    Task Title
                </label>
                <input
                    {...register('title')}
                    placeholder="e.g. Design System Implementation"
                    className={`w-full bg-accent/30 border ${errors.title ? 'border-red-500' : 'border-border/50'} rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all`}
                />
                {errors.title && <p className="text-xs text-red-500 ml-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold ml-1 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-primary" />
                    Description
                </label>
                <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Describe the task details..."
                    className="w-full bg-accent/30 border border-border/50 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Status</label>
                <div className="flex bg-accent/30 p-1 rounded-xl border border-border/50">
                    {(['TODO', 'IN_PROGRESS', 'COMPLETED'] as TaskStatus[]).map((s) => (
                        <label key={s} className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                {...register('status')}
                                value={s}
                                className="sr-only peer"
                            />
                            <div className="py-2.5 text-center text-xs font-bold rounded-lg transition-all text-muted-foreground peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:shadow-md">
                                {s.replace('_', ' ')}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 px-6 rounded-xl font-bold bg-accent/50 hover:bg-accent border border-border/50 transition-all flex items-center justify-center gap-2"
                >
                    <X className="w-5 h-5" />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-3 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            {initialData?.id ? 'Update Task' : 'Create Task'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
