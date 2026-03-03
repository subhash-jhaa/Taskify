'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Task, TaskStatus } from '@/types/task';
import { Loader2, Save, X, Type, AlignLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
    const { register, handleSubmit, control, formState: { errors } } = useForm({
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
                <Label htmlFor="title" className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" />
                    Task Title
                </Label>
                <Input
                    id="title"
                    {...register('title')}
                    placeholder="e.g. Design System Implementation"
                    className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.title && <p className="text-xs text-destructive ml-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-primary" />
                    Description
                </Label>
                <Textarea
                    id="description"
                    {...register('description')}
                    rows={4}
                    placeholder="Describe the task details..."
                    className="resize-none"
                />
            </div>

            <div className="space-y-3">
                <Label>Status</Label>
                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-2"
                        >
                            {(['TODO', 'IN_PROGRESS', 'COMPLETED'] as TaskStatus[]).map((s) => (
                                <div key={s} className="flex-1 min-w-[100px]">
                                    <RadioGroupItem
                                        value={s}
                                        id={`status-${s}`}
                                        className="sr-only"
                                    />
                                    <Label
                                        htmlFor={`status-${s}`}
                                        className={`block w-full py-2.5 text-center text-xs font-bold rounded-lg border cursor-pointer transition-all ${field.value === s
                                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                            : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
                                            }`}
                                    >
                                        {s.replace('_', ' ')}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                />
            </div>

            <div className="flex items-center gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 h-12 rounded-xl font-bold"
                >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" />
                            {initialData?.id ? 'Update Task' : 'Create Task'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

