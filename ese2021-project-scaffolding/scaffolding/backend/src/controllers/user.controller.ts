
import express, { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { verifyToken } from '../middlewares/checkAuth';

const userController: Router = express.Router();
const userService = new UserService();

userController.post('/register',
    (req: Request, res: Response) => {
        userService.register(req.body).then(registered => res.send(registered)).catch(err => res.status(500).send(err));
    }
);

userController.post('/login',
    (req: Request, res: Response) => {
        userService.login(req.body).then(login => res.send(login)).catch(err => res.status(500).send(err));
    }
);

userController.get('/getById',
    (req: Request, res: Response) => {
        userService.getById('' + req.query.userId).then(result => res.send(result)).catch(err => res.status(500).send(err));
    }
);

userController.post('/checkUserNameOrEmailInUse',
    (req: Request, res: Response) => {
        userService.checkUserNameOrEmailInUse(req.body).then(result => res.send(result)).catch(err => res.status(500).send(err));
    }
);

userController.get('/all',
    (req: Request, res: Response) => {
        userService.getAll().then(users => res.send(users)).catch(err => res.status(500).send(err));
    }
);

userController.post('/discoverHouse',
    (req: Request, res: Response) => {
        userService.discoverHouse(req.body).then(house => res.send(house)).catch(err => res.status(500).send(err));
    }
);

export const UserController: Router = userController;
