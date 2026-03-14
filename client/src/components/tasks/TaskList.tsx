'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import TaskCard from './TaskCard';
import { Task, TaskStatus } from '@/types/task';
import { Loader2, Inbox, Plus } from 'lucide-react';
import Link from 'next/link';

interface TaskListProps {
    status?: TaskStatus;
    search?: string;
    limit?: number;
}

export default function TaskList({ status, search, limit }: TaskListProps = {}) {
    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ['tasks', { status, search, limit }],
        queryFn: async () => {
            const params: any = {};
            if (status) params.status = status;
            if (search) params.search = search;
            if (limit) params.limit = limit;

            const { data } = await api.get('tasks', { params });
            return data.tasks as Task[];
        },
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass h-40 rounded-2xl animate-pulse bg-accent/20 border border-border/20" />
                ))}
            </div>
        );
    }

    if (isError || !data || data.length === 0) {
        return (
            <div className="glass p-12 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-accent/50 rounded-2xl flex items-center justify-center mb-6">
                    <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">No tasks found</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                    {search ? 'Try adjusting your search filters.' : "You haven't created any tasks yet. Get started now!"}
                </p>
                {!search && (
                    <Link
                        href="/tasks/new"
                        className="mt-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                        Create First Task
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={() => refetch()} />
            ))}
        </div>
    );
}
