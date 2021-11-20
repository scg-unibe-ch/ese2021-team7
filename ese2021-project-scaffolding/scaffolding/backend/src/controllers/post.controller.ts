
import express, { Router, Request, Response } from 'express';
import { verifyToken } from '../middlewares/checkAuth';
import {PostService} from '../services/post.service';

const postController: Router = express.Router();
const postService = new PostService();

postController.post('/create', verifyToken,
    (req: Request, res: Response) => {
        postService.createPost(req.body, req.body.tokenPayload.userId).then(post => res.send(post)).catch(err => res.status(500).send(err));
    }
);

postController.post('/modify', verifyToken,
    (req: Request, res: Response) => {
        postService.modifyPost(req.body, req.body.tokenPayload.userId).then(post => res.send(post)).catch(err => res.status(500).send(err));
    }
);

postController.post('/delete', verifyToken,
    (req: Request, res: Response) => {
        postService.deletePost(req.body.postId, req.body.tokenPayload.userId)
            .then(() => res.send()).catch(err => res.status(500).send(err));
    }
);

postController.post('/upvote', verifyToken,
    (req: Request, res: Response) => {
        postService.upvote(req.body.postId, req.body.tokenPayload.userId)
            .then(modifiedPost => res.send(modifiedPost)).catch(err => res.status(500).send(err));
    }
);

postController.post('/downvote', verifyToken,
    (req: Request, res: Response) => {
        postService.downvote(req.body.postId, req.body.tokenPayload.userId)
            .then(modifiedPost => res.send(modifiedPost)).catch(err => res.status(500).send(err));
    }
);

postController.get('/all',
    (req: Request, res: Response) => {
        postService.getAll('' + req.query.sortBy).then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

postController.get('/byId',
    (req: Request, res: Response) => {
        postService.getPostById('' + req.query.postId).then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

export const PostController: Router = postController;
