
import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Email already exists
 */
export const registerUser = async (req, res) => {
    const { email, name, password, role } = req.body;

    try {
        const exists = await db.User.findOne({ where: { email } });
        if (exists) return res.status(400).json({ error: 'Email already registered' });

        const user = await db.User.create({ email, name, password, role });
        res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'Registration error', details: err.message });
    }
};


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });
        // jwt.sign(payload,signature,option)
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'Login error', details: err.message });
    }
};

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get list of all users (protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name or email
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */

export const getAllUsers = async (req, res) => {
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const search = req.query.search || '';
    const role = req.query.role || '';

    console.log('getAllUsers called with:', { limit, page, search, role });

    if (isNaN(limit) || isNaN(page)) {
        return res.status(400).json({ error: 'Invalid query parameters' });
    }

    try {
        const whereClause = {};
        
        // Search filter
        if (search) {
            whereClause[db.Sequelize.Op.or] = [
                { name: { [db.Sequelize.Op.like]: `%${search}%` } },
                { email: { [db.Sequelize.Op.like]: `%${search}%` } }
            ];
        }
        
        // Role filter
        if (role) {
            whereClause.role = role;
        }

        console.log('Where clause:', JSON.stringify(whereClause));

        const { count, rows: users } = await db.User.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: (page - 1) * limit,
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        console.log(`Found ${count} users`);

        const response = {
            meta: {
                totalItems: count,
                page: page,
                totalPages: Math.ceil(count / limit),
                limit: limit
            },
            data: users,
        };
        
        console.log('Sending response:', response);
        res.json(response);
    } catch (err) {
        console.error('Error in getAllUsers:', err);
        res.status(500).json({
            error: 'Error fetching users',
            details: err.message,
        });
    }
};

/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     summary: Update a user (protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        
        // Only update password if provided
        if (password) {
            user.password = password; // Will be hashed by the beforeUpdate hook
        }

        await user.save();

        // Return user without password
        const { password: _, ...userWithoutPassword } = user.toJSON();
        res.json({ message: 'User updated successfully', user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Error updating user', details: err.message });
    }
};

/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Delete a user (protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting user', details: err.message });
    }
};

const user_controller = {
    registerUser,
    loginUser,
    getAllUsers,
    updateUser,
    deleteUser
};

export default user_controller;