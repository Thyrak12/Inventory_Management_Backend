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
import { serveSwagger, setupSwagger } from './config/swagger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', serveSwagger, setupSwagger);



app.use('/products', productRoutes(product_controller));
app.use('/product-variants', productVariantRoutes(product_variant_controller));
app.use('/sales', salesRoutes(sales_controller));
app.use('/sales-records', salesRecordRoutes(sales_record_controller));
app.use('/stock-transactions', stockTransactionRoutes(stock_transaction_controller));
app.use('/users', userRoutes(user_controller));


app.use('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
