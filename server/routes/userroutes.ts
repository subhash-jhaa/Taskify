import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUsersData } from '../controllers/usercontroller.js';

const userRouter = express.Router();

// Define user-related routes here
userRouter.get('/data',userAuth,getUsersData);

export default userRouter;