import express from 'express';
import dotenv from 'dotenv';
import product_controller from './controllers/product_controller.js';
import product_variant_controller from './controllers/product_variant_controller.js';
import sales_controller from './controllers/sales_controller.js';
import sales_record_controller from './controllers/sales_record_controller.js';
import stock_transaction_controller from './controllers/stock_transaction_controller.js';
import user_controller from './controllers/user_controller.js';
import productRoutes from './routes/product_route.js';
import productVariantRoutes from './routes/product_variant_route.js';
import salesRoutes from './routes/sales_route.js';
import salesRecordRoutes from './routes/sales_record_route.js';
import stockTransactionRoutes from './routes/stock_transaction_route.js';
import userRoutes from './routes/user_route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/products', productRoutes(product_controller));
app.use('/api/product-variants', productVariantRoutes(product_variant_controller));
app.use('/api/sales', salesRoutes(sales_controller));
app.use('/api/sales-records', salesRecordRoutes(sales_record_controller));
app.use('/api/stock-transactions', stockTransactionRoutes(stock_transaction_controller));
app.use('/api/users', userRoutes(user_controller));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
