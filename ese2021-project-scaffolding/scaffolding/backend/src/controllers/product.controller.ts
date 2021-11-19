
import express, { Router, Request, Response } from 'express';
import {ProductService} from '../services/product.service';

const router: Router = express.Router();
const productService = new ProductService();

router.post('/create',
    (req: Request, res: Response) => {
        productService.createProduct(req.body).then(post => res.send(post)).catch(err => res.status(500).send(err));
    }
);

router.post('/modify',
    (req: Request, res: Response) => {
        productService.modifyProduct(req.body).then(post => res.send(post)).catch(err => res.status(500).send(err));
    }
);

router.post('/delete',
    (req: Request, res: Response) => {
        productService.deleteProduct(req.body.productId).then(() => res.send()).catch(err => res.status(500).send(err));
    }
);

router.get('/all',
    (req: Request, res: Response) => {
        productService.getAll().then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

router.get('/byId',
    (req: Request, res: Response) => {
        productService.getProductById('' + req.query.productId)
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

router.get('/byCategory',
    (req: Request, res: Response) => {
        productService.getProductsByProductCategory('' + req.query.productCategory)
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

export const ProductController: Router = router;
