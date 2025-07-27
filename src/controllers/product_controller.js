import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:   
 *   get:
 *     summary: Get all products with pagination and sorting
 *     tags: [Products]
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
 *         required: false
 *         description: Sort order
 *         schema: { type: string, enum: ['asc', 'desc'], default: 'asc' }
 *       - in: query
 *         name: sortField
 *         required: false
 *         description: Field to sort by
 *         schema: { type: string, enum: ['id', 'title', 'createdAt', 'updatedAt'], default: 'createdAt' }
 *     responses:
 *       200:
 *         description: List of products with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems: { type: integer }
 *                     page: { type: integer }
 *                     totalPages: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
export const getAllProducts = async (req, res) => {
    // Parse and validate query params
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const sort = req.query.sort === 'desc' ? 'DESC' : 'ASC';
    const sortField = req.query.sortField || 'createdAt';

    try {
        const total = await db.Product.count();

        const products = await db.Product.findAll({
            limit: limit,
            offset: (page - 1) * limit, // Calculate pagination offset
            order: [[sortField, sort]],
        });

        res.json({
            meta: {
                totalItems: total,
                page: page,
                totalPages: Math.ceil(total / limit),
            },
            data: products,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Not found
 */
export const getProductById = async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id, { include: db.Category });
        if (!product) return res.status(404).json({ message: 'Not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category]
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 */
export const createProduct = async (req, res) => {
    try {
        const product = await db.Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
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
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */
export const updateProduct = async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Not found' });
        await product.update(req.body);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Not found' });
        await product.destroy();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: Get unique product categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of unique product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
export const getProductCategories = async (req, res) => {
    try {
        const categories = await db.Product.findAll({
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('category')), 'category']
            ],
            raw: true,
        });

        const categoryList = categories.map(c => c.category);
        res.json(categoryList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const productController = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductCategories // ✅ Add this line
};


export default productController;
