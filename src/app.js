import {getProducts, getProductByID, addProduct, updateProduct, deleteProduct} from './controller/productController.js';
import express from 'express';
import createProductRoutes from './routes/productRoute.js';
import connectDB from './config/db_connect.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
connectDB().then(() => {
    console.log('Database connected successfully');
}).catch(err => {
    console.error('Database connection failed:', err);
});
const productControllers = {
    getProducts,
    getProductByID,
    addProduct,
    updateProduct,
    deleteProduct
};
const productRoutes = createProductRoutes(productControllers);
app.use('/', productRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

