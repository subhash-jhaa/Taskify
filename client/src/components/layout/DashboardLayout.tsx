'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, ListTodo, Menu, Plus, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { ModeToggle } from '@/components/mode-toggle';

type NavItem = { label: string; icon: LucideIcon; href: string };

function SidebarContent({
    navItems,
    pathname,
    onNavigate,
    userInitial,
    userName,
    userEmail,
    onLogout,
}: {
    navItems: NavItem[];
    pathname: string | null;
    onNavigate: () => void;
    userInitial: string;
    userName?: string;
    userEmail?: string;
    onLogout: () => void;
}) {
    return (
        <div className="flex flex-col h-full bg-background/50">
            <div className="flex items-center justify-between mb-10 px-2 mt-4 md:mt-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <ListTodo className="text-primary-foreground w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">Taskify</span>
                </div>
                <ModeToggle />
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-border mt-auto mb-6">
                <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-accent/30 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary font-bold">
                        {userInitial}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="w-full justify-start gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'My Tasks', icon: ListTodo, href: '/tasks' },
    ];
    const userInitial = user?.name?.[0]?.toUpperCase() || 'U';

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 glass border-r border-border min-h-screen p-6 flex-col shrink-0">
                <SidebarContent
                    navItems={navItems}
                    pathname={pathname}
                    onNavigate={() => setOpen(false)}
                    userInitial={userInitial}
                    userName={user?.name}
                    userEmail={user?.email}
                    onLogout={logout}
                />
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <ListTodo className="text-primary w-6 h-6" />
                    <span className="text-xl font-bold gradient-text">Taskify</span>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-6 w-72">
                            <SheetHeader className="text-left mb-4">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            </SheetHeader>
                            <SidebarContent
                                navItems={navItems}
                                pathname={pathname}
                                onNavigate={() => setOpen(false)}
                                userInitial={userInitial}
                                userName={user?.name}
                                userEmail={user?.email}
                                onLogout={logout}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold">Hello, {user?.name?.split(' ')[0]} 👋</h2>
                        <p className="text-muted-foreground">Stay productive and organized.</p>
                    </div>
                    <Link
                        href="/tasks/new"
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                        New Task
                    </Link>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
