import { Router } from "express";

const createProductRoutes = (controllers) => {
    const router = Router();

    router.get('/products', controllers.getProducts);
    router.get('/products/:id', controllers.getProductByID);
    router.post('/products', controllers.addProduct);
    router.put('/products/:id', controllers.updateProduct);
    router.delete('/products/:id', controllers.deleteProduct);

    return router;
}

export default createProductRoutes;