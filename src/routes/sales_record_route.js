import { Router } from 'express';

const salesRecordRoutes = (controller) => {
    const routes = Router();

    // Define routes for sales records
    routes.get("/", controller.getAllSalesRecords);
    routes.get("/:id", controller.getSalesRecordById);
    routes.post("/", controller.createSalesRecord);
    routes.put("/:id", controller.updateSalesRecord);
    routes.delete("/:id", controller.deleteSalesRecord);

    return routes;
}

export default salesRecordRoutes;