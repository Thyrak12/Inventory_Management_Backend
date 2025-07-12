import db from '../models/index.js';
const getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
}
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
const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await db.User.create({ name, email, password });
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
}
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