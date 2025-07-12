import { Router } from "express";

const variantRoutes = (controller) => {
    const routes = Router();
    
    routes.get("/", controller.getAllProductVariants);
    routes.get("/:id", controller.getProductVariantById);
    routes.post("/", controller.createProductVariant);
    routes.put("/:id", controller.updateProductVariant);
    routes.delete("/:id", controller.deleteProductVariant);

    return routes;
}

export default variantRoutes;