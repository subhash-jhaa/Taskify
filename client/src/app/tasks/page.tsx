'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskList from '@/components/tasks/TaskList';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Search, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import { TaskStatus } from '@/types/task';

export default function TasksPage() {
    const { isAuthorized, isLoading } = useProtectedRoute();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<TaskStatus | 'ALL'>('ALL');

    if (isLoading || !isAuthorized) return null;

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 max-w-lg relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search tasks by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-accent/40 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/60"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-accent/30 p-1.5 rounded-2xl border border-border/40">
                            {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s as any)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${status === s
                                            ? 'bg-primary text-primary-foreground shadow-lg'
                                            : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {s.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <TaskList
                        status={status === 'ALL' ? undefined : status}
                        search={search}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
