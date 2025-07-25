import {Router} from 'express';

const authRoutes = (controller) => {
  const router = Router();

  router.post('/login', controller.loginUser);
  router.post('/register', controller.registerUser);

  return router;
}

export default authRoutes;