import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   name: Sales Records
 *   description: Sales record management
 */
/**
 * @swagger
 * /sales-records:
 *   get:
 *     summary: Get all sales records
 *     tags: [Sales Records]
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
 *         description: List of sales records
 */
const getAllSalesRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const allowedSortFields = ['id', 'createdAt', 'updatedAt'];
    const allowedSortOrders = ['asc', 'desc'];

    const sortField = allowedSortFields.includes(req.query.sortField) ? req.query.sortField : 'createdAt';
    const sortOrder = allowedSortOrders.includes((req.query.sort || '').toLowerCase()) ? req.query.sort.toUpperCase() : 'ASC';

    const { count, rows } = await db.SalesRecord.findAndCountAll({
      limit,
      offset,
      order: [[sortField, sortOrder]],
      include: [
        {
          model: db.ProductVariant,
          as: 'productVariant',
          attributes: ['id', 'color', 'size'],
          include: [
            {
              model: db.Product,
              attributes: ['name'],
            }
          ]
        },
        {
          model: db.Sales,
          as: 'sales',
          attributes: ['createdAt'],  // Include only createdAt from Sales
        }
      ]
    });

    // Flatten product name and sales createdAt
    const data = rows.map(row => {
      const json = row.toJSON();
      return {
        ...json,
        name: json.productVariant?.product?.name || null,
        saleCreatedAt: json.sales?.createdAt || null,
      };
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data,
    });

  } catch (error) {
    console.error("🔥 Error fetching sales records:", error);
    return res.status(500).json({ error: error.message || 'An error occurred while fetching sales records.' });
  }
};


/**
 * @swagger
 * /sales-records/{id}:
 *   get:
 *     summary: Get a sales record by ID
 *     tags: [Sales Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Sales record found
 *       404:
 *         description: Not found
 */

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

/**
 * @swagger
 * /sales-records:
 *   post:
 *     summary: Create a new sales record
 *     tags: [Sales Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sales_id, product_variant_id, quantity, price]
 *             properties:
 *               sales_id:
 *                 type: integer
 *               product_variant_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Sales record created
 *       500:
 *         description: Internal server error
 */

const createSalesRecord = async (req, res) => {
    const { sales_id, product_variant_id, quantity, price } = req.body;
    try {
        const newSalesRecord = await db.SalesRecord.create({ sales_id, product_variant_id, quantity, price });
        return res.status(201).json(newSalesRecord);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the sales record.' });
    }
}

/**
 * @swagger
 * /sales-records/{id}:
 *   put:
 *     summary: Update a sales record
 *     tags: [Sales Records]
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
 *             required: [sales_id, product_variant_id, quantity, price]
 *             properties:
 *               sales_id:
 *                 type: integer
 *               product_variant_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sales record updated
 *       404:
 *         description: Not found
 */

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

/**
 * @swagger
 * /sales-records/{id}:
 *   delete:
 *     summary: Delete a sales record
 *     tags: [Sales Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Sales record deleted
 *       404:
 *         description: Not found
 */


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