'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * - Wraps protected layouts/pages to ensure the user session is valid.
 * - Leverages the AuthContext to check loading state and user existence.
 * - Shows a premium loading spinner while verification is in progress.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        // If loading finishes and no user is found, redirect to login
        if (!isLoading && !user) {
            setIsRedirecting(true);
            router.replace('/login');
        }
    }, [user, isLoading, router]);

    // Show loading state while checking auth OR while waiting for redirect
    if (isLoading || (!user && isRedirecting)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Verifying session...</p>
            </div>
        );
    }

    // If session is valid, render the protected content
    return user ? <>{children}</> : null;
}
