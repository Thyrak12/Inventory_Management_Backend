import { authenticateToken } from '../middleware/auth.js';
import {Router} from 'express';

const userRoutes = (controller) => {
    const routes = Router();

    // Define routes for user management
    routes.post("/register", controller.registerUser);
    routes.post("/login", controller.loginUser);
    routes.get("/users", authenticateToken, controller.getAllUsers);
    routes.put("/users/:id", authenticateToken, controller.updateUser);
    routes.delete("/users/:id", authenticateToken, controller.deleteUser);

    return routes;
}

export default userRoutes;