import { db } from '../config/db.js';

// Create new task
export const createTask = async (req, res, next) => {
    try {
        const { title, description, status = 'pending' } = req.body;
        const userId = req.user.id;
        const connection = await db;

        const [result] = await connection.query(
            'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
            [title, description, status, userId]
        );

        const [tasks] = await connection.query(
            'SELECT * FROM tasks WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: tasks[0]
        });
    } catch (error) {
        next(error);
    }
};

// Get all tasks for current user
export const getTasks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;
        const connection = await db;

        let query = 'SELECT * FROM tasks WHERE user_id = ?';
        const params = [userId];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const [tasks] = await connection.query(query, params);

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

// Get all tasks (admin only)
export const getAllTasks = async (req, res, next) => {
    try {
        const { status } = req.query;
        const connection = await db;

        let query = 'SELECT t.*, u.username, u.email FROM tasks t JOIN users u ON t.user_id = u.id';
        const params = [];

        if (status) {
            query += ' WHERE t.status = ?';
            params.push(status);
        }

        query += ' ORDER BY t.created_at DESC';

        const [tasks] = await connection.query(query, params);

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

// Get single task
export const getTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const connection = await db;

        const [tasks] = await connection.query(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }

        const task = tasks[0];

        // Check authorization
        if (task.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. You can only access your own tasks.' 
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

// Update task
export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const connection = await db;

        // Check if task exists and user owns it
        const [tasks] = await connection.query(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }

        const task = tasks[0];

        if (task.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. You can only update your own tasks.' 
            });
        }

        // Build update query dynamically
        const updates = [];
        const params = [];

        if (title !== undefined) {
            updates.push('title = ?');
            params.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }
        if (status !== undefined) {
            updates.push('status = ?');
            params.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No fields to update' 
            });
        }

        params.push(id);

        await connection.query(
            `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        const [updatedTasks] = await connection.query(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTasks[0]
        });
    } catch (error) {
        next(error);
    }
};

// Delete task
export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const connection = await db;

        // Check if task exists and user owns it
        const [tasks] = await connection.query(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }

        const task = tasks[0];

        if (task.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. You can only delete your own tasks.' 
            });
        }

        await connection.query('DELETE FROM tasks WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};