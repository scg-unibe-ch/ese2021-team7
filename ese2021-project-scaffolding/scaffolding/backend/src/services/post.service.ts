import { Post, PostAttributes } from '../models/post.model';
import {User} from '../models/user.model';
import {Sequelize} from 'sequelize';
import { VoteService } from './vote.service';
import { ErrorCodes } from '../errorCodes';

export class PostService {
    private voteService: VoteService;

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
        if (sortBy === '1') {
            // @ts-ignore
            return Post.findAll({ order: [['upvote', Sequelize.literal('-'), 'downvote', 'DESC']]});
        }
        return Post.findAll({order: [['createdAt', 'DESC']]});
    }

    public upvote(postId: number, userId: number): Promise<Post> {
        if (!this.voteService.upvote(postId, userId)) {
            return Post.findByPk(postId).then(dbPost => {
                if (dbPost) {
                    return dbPost.save().then(updatedPost => Promise.resolve(updatedPost));
                } else {
                    return Promise.reject({message: 'no post with ID ' + postId + ' exists'});
                }
            });
        } else {
            return Promise.reject({message: 'The user already voted on the post' + postId});
        }
    }

    public downvote(postId: number, userId: number): Promise<Post> {
        if (!this.voteService.downvote(postId, userId)) {
            return Post.findByPk(postId).then(dbPost => {
                if (dbPost) {
                    return dbPost.save().then(updatedPost => Promise.resolve(updatedPost));
                } else {
                    return Promise.reject({message: 'no post with ID ' + postId + ' exists'});
                }
            });
        } else {
            return Promise.reject({message: 'The user already voted on the post' + postId});
        }
    }

    public async modifyPost(modifiedPost: Post, userId): Promise<Post> {
        const user = await User.findByPk(userId);
        if (!user) {
            return Promise.reject({message: 'user does not exist'});
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
        const createdPost = await Post.create(postToCreate);
        // @ts-ignore
        createdPost.setUser(user);
        return createdPost.save().then(updatedPost => Promise.resolve(updatedPost));
    }

    constructor() {
        this.voteService = new VoteService();
    }
}
