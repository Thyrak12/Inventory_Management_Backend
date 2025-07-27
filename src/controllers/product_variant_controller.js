import db from '../models/index.js';


/**
 * @swagger
 * tags:
 *   name: Product Variants
 *   description: Product variant management
 */

/**
 * @swagger
 * /product-variants:
 *   get:
 *     summary: Get all product variants
 *     tags: [Product Variants]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: ['asc', 'desc'], default: 'asc' }
 *         description: Sort order
 *       - in: query
 *     responses:
 *       200:
 *         description: List of product variants
 */
const getAllProductVariants = async (req, res) => {
    try {
        const productVariants = await db.ProductVariant.findAll({
            include: [
                {
                    model: db.Product,
                    attributes: ['name'], // Only get 'name'
                }
            ],
            raw: true,
            nest: true
        });

        // Flatten and rename `Product.name` to just `name`
        const formatted = productVariants.map(variant => {
            const { Product, ...rest } = variant;
            return {
                ...rest,
                name: Product?.name || null, // flatten product name as 'name'
            };
        });

        return res.status(200).json(formatted);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while fetching product variants.',
        });
    }
};



/**
 * @swagger
 * /product-variants/{id}:
 *   get:
 *     summary: Get a product variant by ID
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Product variant found
 *       404:
 *         description: Not found
 */

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

/**
 * @swagger
 * /product-variants:
 *   post:
 *     summary: Create a new product variant
 *     tags: [Product Variants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, name, price, stock]
 *             properties:
 *               product_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product variant created
 */

const createProductVariant = async (req, res) => {
    const { product_id, name, price, stock } = req.body;
    try {
        const newProductVariant = await db.ProductVariant.create({ product_id, name, price, stock });
        return res.status(201).json(newProductVariant);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while creating the product variant.' });
    }
};

/**
 * @swagger
 * /product-variants/{id}:
 *   put:
 *     summary: Update a product variant
 *     tags: [Product Variants]
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
 *               product_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product variant updated
 *       404:
 *         description: Not found
 */

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

/**
 * @swagger
 * /product-variants/{id}:
 *   delete:
 *     summary: Delete a product variant
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Product variant deleted
 *       404:
 *         description: Not found
 */

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