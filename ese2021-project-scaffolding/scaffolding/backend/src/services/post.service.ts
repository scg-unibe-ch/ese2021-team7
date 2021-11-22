import { Post } from '../models/post.model';
import {User} from '../models/user.model';
import {Sequelize} from 'sequelize';
import {CategoryService, CategoryType} from './category.service';

export class PostService {

    private categoryService = new CategoryService();

    public async getPostById(postId: string): Promise<Post> {
        return Post.findByPk(postId).then(dbPost => {
            if (dbPost) {
                return Promise.resolve(dbPost);
            } else {
                return Promise.reject({message: 'no post with ID ' + postId + ' exists'});
            }
        });
    }

    // Should this method be static?
    public async getAll(sortBy: string): Promise<Post[]> {
        if (sortBy === '1') {
            // @ts-ignore
            return Post.findAll({ order: [['upvote', Sequelize.literal('-'), 'downvote', 'DESC']]});
        }
        return Post.findAll({order: [['createdAt', 'DESC']]});
    }

    public upvote(postId: number): Promise<Post> {
        return Post.findByPk(postId).then(dbPost => {
            if (dbPost) {
                dbPost.upvote += 1;
                return dbPost.save().then(updatedPost => Promise.resolve(updatedPost));
            } else {
                return Promise.reject({message: 'no post with ID ' + postId + ' exists'});
            }
        });
    }

    public downvote(postId: number): Promise<Post> {
        return Post.findByPk(postId).then(dbPost => {
            if (dbPost) {
                dbPost.downvote += 1;
                return dbPost.save().then(updatedPost => Promise.resolve(updatedPost));
            } else {
                return Promise.reject({message: 'no post with ID ' + postId + ' exists'});
            }
        });
    }

    public async modifyPost(modifiedPost: Post, userId): Promise<Post> {
        const user = await User.findByPk(userId);
        if (!user) {
            return Promise.reject({message: 'user does not exist'});
        }
        const categoryIsValid = await this.categoryService.categoryIsValid(modifiedPost.category, CategoryType.POST_CATEGORY);
        if (!categoryIsValid) {
            return Promise.reject({message: 'Invalid category: category does not exist, or is of wrong type'});
        }
        return Post.findByPk(modifiedPost.postId).then(async dbPost => {
            if (dbPost) {
                // @ts-ignore
                const dbUser = await dbPost.getUser();
                // @ts-ignore
                if (!user.admin && user.userId !== dbUser.userId) {
                    return Promise.reject({message: 'user ' + user.userName + ' is not permitted to modify posts made by different users'});
                }
                dbPost.title = modifiedPost.title;
                dbPost.text = modifiedPost.text;
                dbPost.category = modifiedPost.category;
                dbPost.image = modifiedPost.image;
                // allow modification of upvotes and downvotes initially
                dbPost.upvote = modifiedPost.upvote;
                dbPost.downvote = modifiedPost.downvote;
                return dbPost.save().then(updatedPost => Promise.resolve(updatedPost));
            } else {
                return Promise.reject({message: 'no post with ID ' + modifiedPost.postId + ' exists'});
            }
        });
    }

    public async deletePost(postId: number, userId): Promise<void> {
        const user = await User.findByPk(userId);
        if (!user) {
            Promise.reject({message: 'user does not exist'});
        }
        return Post.findByPk(postId).then(async dbPost => {
            if (dbPost) {
                // @ts-ignore
                const dbUser = await dbPost.getUser();
                // @ts-ignore
                if (!user.admin && user.userId !== dbUser.userId) {
                    return Promise.reject({message: 'user ' + user.userName + ' is not permitted to modify posts made by different users'});
                }
                return dbPost.destroy();
            } else {
                return Promise.reject({message: 'no post with ID ' + postId + ' exists'});
            }
        });
    }

    // This could also return void, maybe this would make more sense?
    public async createPost(post: Post, userId): Promise<Post> {
        const postToCreate = post;
        postToCreate.upvote = 0;
        postToCreate.downvote = 0;
        const user = await User.findByPk(userId);
        if (!user) {
            return Promise.reject({message: 'user does not exist'});
        }
        if (user.admin) {
            return Promise.reject({message: 'admins are not permitted to create posts'});
        }
        const categoryIsValid = await this.categoryService.categoryIsValid(post.category, CategoryType.POST_CATEGORY);
        if (!categoryIsValid) {
            return Promise.reject({message: 'Invalid category: category does not exist, or is of wrong type'});
        }
        const createdPost = await Post.create(postToCreate);
        // @ts-ignore
        createdPost.setUser(user);
        return createdPost.save().then(updatedPost => Promise.resolve(updatedPost));
    }
}
