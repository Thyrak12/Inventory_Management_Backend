import {Router} from 'express';

const salesRecordRoutes = (controller) => {
    const routes = Router();

    // Define routes for sales records
    routes.get("/", controller.getAllUsers);
    routes.get("/:id", controller.getUserById);
    routes.post("/", controller.createUser);
    routes.put("/:id", controller.updateUser);
    routes.delete("/:id", controller.deleteUser);

    return routes;
}

export default salesRecordRoutes;