export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskFilters {
    status?: TaskStatus;
    search?: string;
    page?: number;
    limit?: number;
}
