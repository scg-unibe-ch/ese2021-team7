
import express, { Router, Request, Response } from 'express';
import {CategoryService} from '../services/category.service';

const categoryController: Router = express.Router();
const categoryService = new CategoryService();

categoryController.post('/create',
    (req: Request, res: Response) => {
        categoryService.createCategory(req.body).then(category => res.send(category)).catch(err => res.status(500).send(err));
    }
);

categoryController.get('/all',
    (req: Request, res: Response) => {
        categoryService.getAll().then(categorys => res.send(categorys)).catch(err => res.status(500).send(err));
    }
);

categoryController.get('/byId',
    (req: Request, res: Response) => {
        categoryService.getById('' + req.query.categoryId).then(categorys => res.send(categorys)).catch(err => res.status(500).send(err));
    }
);

categoryController.post('/modify',
    (req: Request, res: Response) => {
        categoryService.modifyCategory(req.body).then(category => res.send(category)).catch(err => res.status(500).send(err));
    }
);


export const CategoryController: Router = categoryController;
