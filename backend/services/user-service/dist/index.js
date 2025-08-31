"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';
// Middleware
app.use(body_parser_1.default.json());
// In-memory user storage (for simplicity, replace with a database in production)
const users = [];
// Routes
// User Registration
app.post('/api/auth/register', (req, res) => {
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
});
// User Authentication
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jsonwebtoken_1.default.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});
// User Retrieval
app.get('/api/users/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is required.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        res.json({ email: decoded.email });
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});
// User Logout
app.post('/api/auth/logout', (req, res) => {
    // For stateless JWT, logout is handled on the client side by deleting the token.
    res.json({ message: 'Logged out successfully.' });
});
// Start the server
app.listen(PORT, () => {
    console.log(`User Service is running on http://localhost:${PORT}`);
});
