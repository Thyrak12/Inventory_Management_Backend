import db from '../models/index.js';
const getAllStockTransactions = async (req, res) => {
    try {
        const stockTransactions = await db.StockTransaction.findAll({
            include: [
                { model: db.ProductVariant, as: 'productVariant' }
            ]
        });
        return res.status(200).json(stockTransactions);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching stock transactions.' });
    }
}
const getStockTransactionById = async (req, res) => {
    const { id } = req.params;
    try {
        const stockTransaction = await db.StockTransaction.findByPk(id, {
            include: [
                { model: db.ProductVariant, as: 'productVariant' }
            ]
        });
        if (!stockTransaction) {
            return res.status(404).json({ error: 'Stock transaction not found.' });
        }
        return res.status(200).json(stockTransaction);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the stock transaction.' });
    }
}
const createStockTransaction = async (req, res) => {
    const { product_variant_id, quantity, transaction_type } = req.body;
    try {
        const newStockTransaction = await db.StockTransaction.create({ product_variant_id, quantity, transaction_type });
        return res.status(201).json(newStockTransaction);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the stock transaction.' });
    }
}
const updateStockTransaction = async (req, res) => {
    const { id } = req.params;
    const { product_variant_id, quantity, transaction_type } = req.body;
    try {
        const stockTransaction = await db.StockTransaction.findByPk(id);
        if (!stockTransaction) {
            return res.status(404).json({ error: 'Stock transaction not found.' });
        }
        stockTransaction.product_variant_id = product_variant_id;
        stockTransaction.quantity = quantity;
        stockTransaction.transaction_type = transaction_type;
        await stockTransaction.save();
        return res.status(200).json(stockTransaction);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while updating the stock transaction.' });
    }
}
const deleteStockTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const stockTransaction = await db.StockTransaction.findByPk(id);
        if (!stockTransaction) {
            return res.status(404).json({ error: 'Stock transaction not found.' });
        }
        await stockTransaction.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the stock transaction.' });
    }
}
const stockTransactionController = {
    getAllStockTransactions,
    getStockTransactionById,
    createStockTransaction,
    updateStockTransaction,
    deleteStockTransaction
};

export default stockTransactionController;