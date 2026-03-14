'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskList from '@/components/tasks/TaskList';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Redundant: ProtectedRoute component in DashboardLayout already handles this
  // const { isLoading: authLoading, isAuthorized } = useProtectedRoute();
  const isAuthorized = true; // Still needed for the query 'enabled' flag to be truthy once mounted in layout

  const { data: statsData } = useQuery({
    queryKey: ['task-stats'],
    queryFn: async () => {
      const { data } = await api.get('tasks/stats');
      return data.stats;
    },
    enabled: isAuthorized,
  });


  const stats = [
    { label: 'Total Tasks', value: statsData?.total || '0', icon: Circle, color: 'text-primary' },
    { label: 'In Progress', value: statsData?.inProgress || '0', icon: Clock, color: 'text-blue-500' },
    { label: 'Completed', value: statsData?.completed || '0', icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Total Projects', value: '1', icon: AlertCircle, color: 'text-red-500' },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl flex flex-col gap-4 border border-border/50 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">{stat.label}</span>
              <stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform`} />
            </div>
            <p className="text-4xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Tasks</h3>
            <Link href="/tasks" className="text-primary hover:underline font-medium text-sm">
              View all
            </Link>
          </div>

          <TaskList limit={3} />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Performance</h3>
          <div className="glass p-8 rounded-2xl flex items-center justify-center min-h-[300px] border border-border/40">
            <div className="text-center">
              <p className="text-3xl font-black">78%</p>
              <p className="text-sm text-muted-foreground mt-1">Growth this week</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

