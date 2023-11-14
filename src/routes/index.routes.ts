import { Request, Response, Router } from 'express';
import { privateRouter, publicRouters } from '../middlewares/auth/privateRoutes';

const router = Router();

router.get('api/products', privateRouter, (req: Request, res: Response) => {
  res.render('products');
});

router.get('/login', publicRouters, (req: Request, res: Response) => {
  res.render('login', { title: 'Login' });
});

router.get('/register', publicRouters, (req: Request, res: Response) => {
  res.render('register', { title: 'Register' });
});

export default router;