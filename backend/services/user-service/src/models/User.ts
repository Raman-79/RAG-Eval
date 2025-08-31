export interface User {
    email: string;
    password: string;
}

// In-memory user storage (for simplicity, replace with a database in production)
export const users: User[] = [];
