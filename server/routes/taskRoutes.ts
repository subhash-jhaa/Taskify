import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, toggleTaskStatus, getTaskStats } from '../controllers/taskController.js';
import userAuth from '../middleware/userAuth.js';
import { decryptRequest, encryptResponse } from '../middleware/encryptionMiddleware.js';

const taskRouter = express.Router();

// All task routes require authentication
taskRouter.use(userAuth);

taskRouter.get('/stats', getTaskStats);

taskRouter.route('/')
    .post(decryptRequest, createTask)
    .get(encryptResponse, getTasks);

taskRouter.route('/:id')
    .get(encryptResponse, getTaskById)
    .patch(decryptRequest, updateTask)
    .delete(deleteTask);

taskRouter.patch('/:id/toggle', toggleTaskStatus);

export default taskRouter;
