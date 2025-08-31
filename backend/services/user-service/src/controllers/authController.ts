import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

export const register = (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    users.push({ email, password });
    res.status(201).json({ message: 'User registered successfully.' });
};

export const login = (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
};

export const getCurrentUser = (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { email: string };
        res.json({ email: decoded.email });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.json({ message: 'Logged out successfully.' });
};
