import express from 'express';
import { 
    createTask, 
    getTasks, 
    getAllTasks,
    getTask, 
    updateTask, 
    deleteTask 
} from '../controllers/taskController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateTask } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// User routes
router.post('/', validateTask, createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', validateTask, updateTask);
router.delete('/:id', deleteTask);

// Admin only route
router.get('/admin/all', isAdmin, getAllTasks);

export default router;