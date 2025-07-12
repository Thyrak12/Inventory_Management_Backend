import {Router} from 'express';

const salesRecordRoutes = (controller) => {
    const routes = Router();

    // Define routes for sales records
    routes.get("/", controller.getAllStockTransactions);
    routes.get("/:id", controller.getStockTransactionById);
    routes.post("/", controller.createStockTransaction);
    routes.put("/:id", controller.updateStockTransaction);
    routes.delete("/:id", controller.deleteStockTransaction);

    return routes;
}

export default salesRecordRoutes;