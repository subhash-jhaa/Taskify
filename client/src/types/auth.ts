export interface User {
    id: string;
    name: string;
    email: string;
    isAccountVerified: boolean;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}
