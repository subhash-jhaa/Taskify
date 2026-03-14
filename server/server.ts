/**
 * Taskify Backend - Production Server
 * Forced rebuild to clear stale Prisma config references
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authroutes.js';
import userRouter from './routes/userroutes.js';
import taskRouter from './routes/taskRoutes.js';

const app = express();
const PORT: string | number = process.env.PORT || 4001;

// Prevent unhandled promise rejections from crashing the server
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection:', reason);
});

// Middleware
app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || origin.includes('localhost') || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Taskify API is running 🚀' });
});

// API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter);

app.listen(PORT, () => {
    console.log(`✅ Taskify server running on http://localhost:${PORT}`);
});
