const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Apply middleware to all routes
router.use(authenticateToken);

// Get all todos for the logged-in user
router.get('/', async (req, res) => {
    const userId = req.user.id;
    const { status, search } = req.query;

    let query = 'SELECT * FROM todos WHERE user_id = ?';
    let params = [userId];

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    if (search) {
        query += ' AND (title LIKE ? OR content LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    try {
        const [todos] = await db.query(query, params);
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new todo
router.post('/', async (req, res) => {
    const userId = req.user.id;
    const { title, content, deadline, priority } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO todos (user_id, title, content, deadline, priority) VALUES (?, ?, ?, ?, ?)',
            [userId, title, content, deadline || null, priority || 'MEDIUM']
        );

        const [newTodo] = await db.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
        res.status(201).json(newTodo[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a todo
router.put('/:id', async (req, res) => {
    const userId = req.user.id;
    const todoId = req.params.id;
    const { title, content, deadline, priority, status } = req.body;

    try {
        // Check ownership
        const [todos] = await db.query('SELECT * FROM todos WHERE id = ? AND user_id = ?', [todoId, userId]);
        if (todos.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Build update query dynamically
        const fields = [];
        const values = [];

        if (title !== undefined) { fields.push('title = ?'); values.push(title); }
        if (content !== undefined) { fields.push('content = ?'); values.push(content); }
        if (deadline !== undefined) { fields.push('deadline = ?'); values.push(deadline); }
        if (priority !== undefined) { fields.push('priority = ?'); values.push(priority); }
        if (status !== undefined) { fields.push('status = ?'); values.push(status); }

        if (fields.length === 0) {
            return res.json(todos[0]); // Nothing to update
        }

        values.push(todoId);
        values.push(userId);

        await db.query(`UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);

        const [updatedTodo] = await db.query('SELECT * FROM todos WHERE id = ?', [todoId]);
        res.json(updatedTodo[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    const userId = req.user.id;
    const todoId = req.params.id;

    try {
        const [result] = await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [todoId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
