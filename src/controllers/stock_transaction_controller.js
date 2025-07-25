import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   name: Stock Transactions
 *   description: Stock transaction management
 */

/**
 * @swagger
 * /stock-transactions:
 *   get:
 *     summary: Get all stock transactions
 *     tags: [Stock Transactions]
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
 *         description: List of stock transactions
 */

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

/**
 * @swagger
 * /stock-transactions/{id}:
 *   get:
 *     summary: Get a stock transaction by ID
 *     tags: [Stock Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stock transaction found
 *       404:
 *         description: Not found
 */

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

/**
 * @swagger
 * /stock-transactions:
 *   post:
 *     summary: Create a new stock transaction
 *     tags: [Stock Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_variant_id, quantity, transaction_type]
 *             properties:
 *               product_variant_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               transaction_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stock transaction created
 *       500:
 *         description: Internal server error
 */

const createStockTransaction = async (req, res) => {
    const { product_variant_id, quantity, transaction_type } = req.body;
    try {
        const newStockTransaction = await db.StockTransaction.create({ product_variant_id, quantity, transaction_type });
        return res.status(201).json(newStockTransaction);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the stock transaction.' });
    }
}

/**
 * @swagger
 * /stock-transactions/{id}:
 *   put:
 *     summary: Update a stock transaction
 *     tags: [Stock Transactions]
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
 *             required: [product_variant_id, quantity, transaction_type]
 *             properties:
 *               product_variant_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               transaction_type:
 *                 type: string
 *     responses:   
 *       200:
 *         description: Stock transaction updated
 *       404:
 *         description: Not found
 */

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

/**
 * @swagger
 * /stock-transactions/{id}:
 *   delete:
 *     summary: Delete a stock transaction
 *     tags: [Stock Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Stock transaction deleted
 *       404:
 *         description: Not found
 */

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