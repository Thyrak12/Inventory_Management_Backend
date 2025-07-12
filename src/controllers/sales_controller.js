import db from "../models/index.js";
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