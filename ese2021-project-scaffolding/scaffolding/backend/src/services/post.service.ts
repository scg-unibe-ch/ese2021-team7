import { Post, PostAttributes } from '../models/post.model';
import {User} from '../models/user.model';


export class PostService {
    public getPostById(postId: number): Promise<Post> {
        // TODO: Implement logic
        return Promise.reject();
    }

    public getPostByUser(user: User, sortBy = 0): Promise<Post> {
        // TODO: Implement logic
        return Promise.reject();
    }

    public getAllPosts(sortBy: number = 0): Promise<Post> {
        // TODO: Implement logic
        return Promise.reject();
    }

    public upvote(): Promise<Post> {
        // TODO: Implement logic
        return Promise.reject();
    }

    public downvote(): Promise<Post> {
        // TODO: Implement logic
        return Promise.reject();
    }

    public changePost(modifiedPost: Post): Promise<Post> {
        // TODO: Implement logic
        return Promise.reject();
    }

    public changeCategory(newCategory: number): Promise<Post> {
        // TODO: Change value of inputparameter of string to int of category enum
        // TODO: Implement logic
        return Promise.reject();
    }

    private modifyPost(modifiedPost: Post): Promise<Post> {
        // TODO: Implement logic
        return Promise.reject();
    }

    private calculateScore(postId: number): number {
        // TODO: Implement logic
        return -1;
    }
}
