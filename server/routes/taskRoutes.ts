import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, toggleTaskStatus } from '../controllers/taskController.js';
import userAuth from '../middleware/userAuth.js';

const taskRouter = express.Router();

// All task routes require authentication
taskRouter.use(userAuth);

taskRouter.route('/')
    .post(createTask)
    .get(getTasks);

taskRouter.route('/:id')
    .get(getTaskById)
    .patch(updateTask)
    .delete(deleteTask);

taskRouter.patch('/:id/toggle', toggleTaskStatus);

export default taskRouter;
