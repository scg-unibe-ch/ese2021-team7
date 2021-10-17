
import express, { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { verifyToken } from '../middlewares/checkAuth';
import {PostService} from '../services/post.service';

const postController: Router = express.Router();
const postService = new PostService();

postController.use(verifyToken);

postController.post('/create',
    (req: Request, res: Response) => {
        postService.createPost(req.body, req.body.tokenPayload.userId).then(post => res.send(post)).catch(err => res.status(500).send(err));
    }
);

postController.post('/upvote',
    (req: Request, res: Response) => {
        postService.upvote(req.body).then(modifiedPost => res.send(modifiedPost)).catch(err => res.status(500).send(err));
    }
);

postController.post('/downvote',
    (req: Request, res: Response) => {
        postService.downvote(req.body).then(modifiedPost => res.send(modifiedPost)).catch(err => res.status(500).send(err));
    }
);
//
// postController.get('/', verifyToken, // you can add middleware on specific requests like that
//     (req: Request, res: Response) => {
//         postService.getAll().then(users => res.send(users)).catch(err => res.status(500).send(err));
//     }
// );

export const PostController: Router = postController;
