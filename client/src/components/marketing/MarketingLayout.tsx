'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

import { ListTodo } from 'lucide-react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ListTodo className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-2xl font-bold gradient-text">Taskify</span>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button type="button" variant="ghost" onClick={logout}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-14">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 sm:px-6 pb-10 pt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Taskify</p>
      </footer>
    </div>
  );
}

