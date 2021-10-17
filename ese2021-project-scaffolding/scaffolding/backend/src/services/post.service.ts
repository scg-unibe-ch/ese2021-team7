import { Post, PostAttributes } from '../models/post.model';
import {User} from '../models/user.model';
import { where } from 'sequelize';


export class PostService {
    // Should this method be static?
    public async getPostById(postId: number): Promise<Post> {
        const postPromise = await Post.findByPk(postId);
        return postPromise;
    }

    // Should this method be static?
    public getPostByUser(user: User, sortBy = 0): Promise<Post> {
        // TODO: Implement logic
        return Promise.reject();
    }

    // Should this method be static?
    public async getAllPosts(sortBy: number = 0): Promise<Post[]> {
        const allPosts = await Post.findAll();
        return allPosts;
    }

    public upvote(post: Post): Promise<Post> {
        return Post.findByPk(post.postId).then(dbPost => {
            dbPost.upvote += 1;
            return dbPost.save().then(updatedPost => Promise.resolve(updatedPost));
        });
    }

    public downvote(post: Post): Promise<Post> {
        return Post.findByPk(post.postId).then(dbPost => {
            dbPost.downvote += 1;
            return dbPost.save().then(updatedPost => Promise.resolve(updatedPost));
        });
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

    // This could also return void, maybe this would make more sense?
    public async createPost(post: Post, userId): Promise<Post> {
        const postToCreate = post;
        postToCreate.upvote = 0;
        postToCreate.downvote = 0;
        const user = await User.findByPk(userId);
        // console.log(Post.instance.prototype);
        // postToCreate.setUser(user);
        const createdPost = await Post.create(postToCreate);
        // @ts-ignore
        createdPost.setUser(user);
        // @ts-ignore
        return createdPost.save().then(updatedPost => Promise.resolve(updatedPost));
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
