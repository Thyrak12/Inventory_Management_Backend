import db from '../models/index.js';
const getAllSalesRecords = async (req, res) => {
    try {
        const salesRecords = await db.SalesRecord.findAll({
            include: [
                { model: db.Sales, as: 'sales' },
                { model: db.ProductVariant, as: 'productVariant' }
            ]
        });
        return res.status(200).json(salesRecords);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching sales records.' });
    }
}
const getSalesRecordById = async (req, res) => {
    const { id } = req.params;
    try {
        const salesRecord = await db.SalesRecord.findByPk(id, {
            include: [
                { model: db.Sales, as: 'sales' },
                { model: db.ProductVariant, as: 'productVariant' }
            ]
        });
        if (!salesRecord) {
            return res.status(404).json({ error: 'Sales record not found.' });
        }
        return res.status(200).json(salesRecord);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching the sales record.' });
    }
}
const createSalesRecord = async (req, res) => {
    const { sales_id, product_variant_id, quantity, price } = req.body;
    try {
        const newSalesRecord = await db.SalesRecord.create({ sales_id, product_variant_id, quantity, price });
        return res.status(201).json(newSalesRecord);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the sales record.' });
    }
}
const updateSalesRecord = async (req, res) => {
    const { id } = req.params;
    const { sales_id, product_variant_id, quantity, price } = req.body;
    try {
        const salesRecord = await db.SalesRecord.findByPk(id);
        if (!salesRecord) {
            return res.status(404).json({ error: 'Sales record not found.' });
        }
        salesRecord.sales_id = sales_id;
        salesRecord.product_variant_id = product_variant_id;
        salesRecord.quantity = quantity;
        salesRecord.price = price;
        await salesRecord.save();
        return res.status(200).json(salesRecord);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while updating the sales record.' });
    }
}
const deleteSalesRecord = async (req, res) => {
    const { id } = req.params;
    try {
        const salesRecord = await db.SalesRecord.findByPk(id);
        if (!salesRecord) {
            return res.status(404).json({ error: 'Sales record not found.' });
        }
        await salesRecord.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the sales record.' });
    }
}
const salesRecordController = {
    getAllSalesRecords,
    getSalesRecordById,
    createSalesRecord,
    updateSalesRecord,
    deleteSalesRecord
};

export default salesRecordController;