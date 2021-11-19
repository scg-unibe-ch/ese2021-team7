
import express, { Router, Request, Response } from 'express';
import {OrderService} from '../services/oder.service';

const router: Router = express.Router();
const orderService = new OrderService();

router.post('/create',
    (req: Request, res: Response) => {
        orderService.createOrder(req.body).then(post => res.send(post)).catch(err => res.status(500).send(err));
    }
);

router.get('/all',
    (req: Request, res: Response) => {
        orderService.getAll().then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

router.get('/byId',
    (req: Request, res: Response) => {
        orderService.getOrderById('' + req.query.oderId)
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

router.get('/byUser',
    (req: Request, res: Response) => {
        orderService.getOrdersByUser('' + req.query.userId)
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

router.post('/modify',
    (req: Request, res: Response) => {
        orderService.modifyOrder(req.body).then(post => res.send(post)).catch(err => res.status(500).send(err));
    }
);

router.post('/cancel',
    (req: Request, res: Response) => {
        orderService.cancelOrder(req.body.orderId).then(post => res.send(post)).catch(err => res.status(500).send(err));
    }
);

router.post('/ship',
    (req: Request, res: Response) => {
        orderService.shipOrder(req.body.orderId).then(post => res.send(post)).catch(err => res.status(500).send(err));
    }
);

router.post('/delete',
    (req: Request, res: Response) => {
        orderService.deleteOrder(req.body.orderId).then(() => res.send()).catch(err => res.status(500).send(err));
    }
);
export const OrderController: Router = router;
