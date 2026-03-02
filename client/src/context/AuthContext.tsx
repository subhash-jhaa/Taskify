'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load user on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data } = await api.get('/user/data');
            if (data.success) {
                setUser(data.userData);
            }
        } catch (error) {
            console.log('No active session found');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: any) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            if (data.success) {
                toast.success('LoggedIn Successfully');
                await checkAuth();
                router.push('/');
            }
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
            throw error;
        }
    };

    const register = async (userData: any) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            if (data.success) {
                toast.success('Registration successful. Please login.');
                router.push('/login');
            }
        } catch (error: any) {
            toast.error(error.message || 'Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error: any) {
            toast.error('Logout failed');
        }
    };

    const refresh = async () => {
        try {
            await api.post('/auth/refresh');
            await checkAuth();
        } catch (error) {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
