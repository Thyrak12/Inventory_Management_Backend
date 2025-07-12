import db from '../models/index.js';
const getAllProducts = async (req, res) => {
    try {
        const products = await db.Product.findAll();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
}

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await db.Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the product.' });
    }
}

const createProduct = async (req, res) => {
    const { name, description, category } = req.body;
    try {
        const newProduct = await db.Product.create({ name, description, category });
        return res.status(201).json(newProduct);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the product.' });
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, category } = req.body;
    try {
        const product = await db.Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        product.name = name;
        product.description = description;
        product.category = category;
        await product.save();
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while updating the product.' });
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await db.Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        await product.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the product.' });
    }
}

const productController = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

export default productController;