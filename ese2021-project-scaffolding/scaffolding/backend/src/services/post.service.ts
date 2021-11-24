import { Post } from '../models/post.model';
import {User} from '../models/user.model';
import {Sequelize} from 'sequelize';
import { VoteService } from './vote.service';
import { Vote } from '../models/vote.model';
import { ErrorCodes } from '../errorCodes';
import {CategoryService, CategoryType} from './category.service';

export class PostService {

    private categoryService = new CategoryService();
    private voteService: VoteService;

    // Should this method be static?
    public async getPostById(postId: string): Promise<Post> {
        return Post.findByPk(postId).then(dbPost => {
            if (dbPost) {
                return Promise.resolve(dbPost);
            } else {
                return Promise.reject({message: 'no post with ID ' + postId + ' exists'});
            }
        });
    }

    public async getAll(sortBy: string): Promise<Post[]> {
        // TODO: Fix query
        const unorderdPosts = await Post.findAll({
            attributes: ['postId', 'title', 'image', 'text', 'category'],
            include: [{model: Vote, attributes: [[sequelize.fn('sum', sequelize.col('upvote')), 'total_votes']]}],
            group: ['postId', 'title', 'image', 'text', 'category']
        });
        const orderedPosts: Post[] = [];

        // TODO: Write logic
        // if (sortBy == '1') {
        //     orderByUpvotes
        // } else {
        //      orderByCreateDate
        // }
        return orderedPosts;
    }

    public async upvote(postId: number, userId: number): Promise<Post> {
        const hasVoted = await this.voteService.alreadyVoted(postId, userId);
        if (hasVoted) {
            return Promise.reject({message: 'user ' + userId + ' has already voted on post ' + postId});
        } else {
            this.voteService.upvote(postId, userId);
            const post = await Post.findByPk(postId);
            return Promise.resolve(post);
        }
    }

    public async downvote(postId: number, userId: number): Promise<Post> {
        const hasVoted = await this.voteService.alreadyVoted(postId, userId);

        if (hasVoted) {
            return Promise.reject({message: 'user ' + userId + ' has already voted on post ' + postId});
        } else {
            this.voteService.downvote(postId, userId);
            const post = await Post.findByPk(postId);
            return Promise.resolve(post);
        }
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

    public async createPost(post: Post, userId): Promise<Post> {
        const postToCreate = post;
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

    constructor() {
        this.voteService = new VoteService();
    }
}
