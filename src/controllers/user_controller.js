import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: ['asc', 'desc'], default: 'asc' }
 *         description: Sort order
 *       - in: query
 *         name: sortField
 *         schema: { type: string, enum: ['id', 'createdAt', 'updatedAt'], default: 'createdAt' }
 *         description: Sort by field
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */

const getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
}

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: Not found
 */

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
}

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       500:
 *         description: Internal server error
 */

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await db.User.create({ name, email, password });
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
}

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: Not found
 */

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        user.name = name;
        user.email = email;
        user.password = password;
        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
}

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: Not found
 */

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        await user.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
}

const userController = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};

export default userController;