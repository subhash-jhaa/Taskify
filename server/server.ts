import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authroutes.js';
import userRouter from './routes/userroutes.js';
import taskRouter from './routes/taskRoutes.js';

const app = express();
const PORT: string | number = process.env.PORT || 4000;
connectDB();

// Middleware
app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow localhost
        if (!origin || origin.includes('localhost')) {
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


//  Api Endpoints
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

