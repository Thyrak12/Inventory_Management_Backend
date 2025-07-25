import db from "../models/index.js";

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales management
 */

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
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
 *         description: List of sales
 */


const getAllSales = async (req, res) => {
    try {
        const sales = await db.Sales.findAll({
            include: [
                { model: db.User, as: 'user' },
                { model: db.SalesRecord, as: 'salesRecords' }
            ]
        });
        return res.status(200).json(sales);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching sales.' });
    }
};

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Get a sale by ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Sale found
 *       404:
 *         description: Not found
 */

const getSaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await db.Sales.findByPk(id, {
            include: [
                { model: db.User, as: 'user' },
                { model: db.SalesRecord, as: 'salesRecords' }
            ]
        });
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found.' });
        }
        return res.status(200).json(sale);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the sale.' });
    }
};

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, salesRecords]
 *             properties:
 *               user_id:
 *                 type: integer
 *               salesRecords:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [product_id, quantity]
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Sale created
 *       500:
 *         description: Internal server error
 */

const createSale = async (req, res) => {
    const { user_id, salesRecords } = req.body;
    try {
        const newSale = await db.Sales.create({ user_id });
        if (salesRecords && salesRecords.length > 0) {
            const records = salesRecords.map(record => ({
                ...record,
                sales_id: newSale.id
            }));
            await db.SalesRecord.bulkCreate(records);
        }
        return res.status(201).json(newSale);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the sale.' });
    }
};

/**
 * @swagger
 * /sales/{id}:
 *   put:
 *     summary: Update a sale
 *     tags: [Sales]
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
 *             required: [user_id, salesRecords]
 *             properties:
 *               user_id:
 *                 type: integer
 *               salesRecords:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [product_id, quantity]
 *     responses:
 *       200:
 *         description: Sale updated
 *       404:
 *         description: Not found
 */

const updateSale = async (req, res) => {
    const { id } = req.params;
    const { user_id, salesRecords } = req.body;
    try {
        const sale = await db.Sales.findByPk(id);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found.' });
        }
        sale.user_id = user_id;
        await sale.save();

        if (salesRecords && salesRecords.length > 0) {
            await db.SalesRecord.destroy({ where: { sales_id: id } });
            const records = salesRecords.map(record => ({
                ...record,
                sales_id: sale.id
            }));
            await db.SalesRecord.bulkCreate(records);
        }
        return res.status(200).json(sale);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while updating the sale.' });
    }
};

/**
 * @swagger
 * /sales/{id}:
 *   delete:
 *     summary: Delete a sale
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Sale deleted
 *       404:
 *         description: Not found
 */

const deleteSale = async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await db.Sales.findByPk(id);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found.' });
        }
        await sale.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the sale.' });
    }
};
const salesController = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale
};

export default salesController;