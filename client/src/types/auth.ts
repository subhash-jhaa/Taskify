export interface User {
    id: string;
    name: string;
    email: string;
    isAccountVerified: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}
