'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { User, AuthContextType, LoginCredentials, RegisterInput } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getErrorMessage(error: any, fallback: string) {
    if (typeof error === 'string' && error.trim()) return error;
    if (error?.message && typeof error.message === 'string' && error.message.trim()) return error.message;
    if (error instanceof Error && error.message.trim()) return error.message;
    return fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load user on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        // 🚀 Check for the non-httpOnly 'client_session' indicator first
        // This avoids making a network request if no session exists locally
        const hasSessionIndicator = typeof document !== 'undefined' && document.cookie.includes('client_session=true');

        if (!hasSessionIndicator) {
            console.log('No session indicator found, skipping initial auth check.');
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await api.get('/user/data', {
                headers: { 'x-auth-check': 'true' } // Tells the interceptor to be silent
            });
            if (data.success) {
                setUser(data.userData);
            }
        } catch (error) {
            // Silently fail: the user is not logged in or session expired
            console.log('Initial auth check: No active session');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            if (data.success) {
                // 🚀 Set the session indicator manually
                document.cookie = 'client_session=true; path=/; max-age=604800'; // 7 days
                
                // Use the returned user data directly
                setUser(data.user);
                setIsLoading(false);
                
                toast.success('LoggedIn Successfully');
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error(getErrorMessage(error, 'Login failed'));
            throw error;
        }
    };

    const register = async (userData: RegisterInput) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            if (data.success) {
                // 🚀 Set the session indicator manually to avoid waiting for cookies to propagate
                document.cookie = 'client_session=true; path=/; max-age=604800'; // 7 days
                
                // Use the returned user data directly
                setUser(data.user);
                setIsLoading(false);
                
                toast.success('Registration successful! Welcome aboard.');
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error(getErrorMessage(error, 'Registration failed'));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            // 🚀 Clear the client-side session indicator
            document.cookie = 'client_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            toast.success('Logged out successfully');
            router.push('/login');
        } catch {
            toast.error('Logout failed');
        }
    };

    const refresh = async () => {
        try {
            await api.post('/auth/refresh');
            await checkAuth();
        } catch {
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
