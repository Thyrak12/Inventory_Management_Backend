import {Router} from 'express';

const salesRecordRoutes = (controller) => {
    const routes = Router();

    // Define routes for sales records
    routes.get("/", controller.getAllSales);
    routes.get("/:id", controller.getSaleById);
    routes.post("/", controller.createSale);
    routes.put("/:id", controller.updateSale);
    routes.delete("/:id", controller.deleteSale);

    return routes;
}

export default salesRecordRoutes;