import db from '../models/index.js';
const getAllProductVariants = async (req, res) => {
    try {
        const productVariants = await db.ProductVariant.findAll();
        return res.status(200).json(productVariants);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching product variants.' });
    }
};
const getProductVariantById = async (req, res) => {
    const { id } = req.params;
    try {
        const productVariant = await db.ProductVariant.findByPk(id);
        if (!productVariant) {
            return res.status(404).json({ error: 'Product variant not found.' });
        }
        return res.status(200).json(productVariant);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the product variant.' });
    }
};
const createProductVariant = async (req, res) => {
    const { product_id, name, price, stock } = req.body;
    try {
        const newProductVariant = await db.ProductVariant.create({ product_id, name, price, stock });
        return res.status(201).json(newProductVariant);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the product variant.' });
    }
};
const updateProductVariant = async (req, res) => {
    const { id } = req.params;
    const { product_id, name, price, stock } = req.body;
    try {
        const productVariant = await db.ProductVariant.findByPk(id);
        if (!productVariant) {
            return res.status(404).json({ error: 'Product variant not found.' });
        }
        productVariant.product_id = product_id;
        productVariant.name = name;
        productVariant.price = price;
        productVariant.stock = stock;
        await productVariant.save();
        return res.status(200).json(productVariant);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while updating the product variant.' });
    }
};
const deleteProductVariant = async (req, res) => {
    const { id } = req.params;
    try {
        const productVariant = await db.ProductVariant.findByPk(id);
        if (!productVariant) {
            return res.status(404).json({ error: 'Product variant not found.' });
        }
        await productVariant.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the product variant.' });
    }
};
const productVariantController = {
    getAllProductVariants,
    getProductVariantById,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant
};

export default productVariantController;