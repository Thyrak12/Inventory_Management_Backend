import { Router } from "express";

const productRoutes = (controller) => {
    const routes = Router();
    routes.get("/", controller.getAllProducts);
    routes.get('/categories', controller.getProductCategories);
    routes.get("/:id", controller.getProductById);
    routes.post("/", controller.createProduct);
    routes.put("/:id", controller.updateProduct);
    routes.delete("/:id", controller.deleteProduct);

    return routes;
}

export default productRoutes;