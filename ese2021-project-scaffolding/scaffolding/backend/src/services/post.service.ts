import { Post } from '../models/post.model';
import {User} from '../models/user.model';
import { VoteService } from './vote.service';
import { Vote } from '../models/vote.model';
import {CategoryService, CategoryType} from './category.service';

export class PostService {

    private categoryService = new CategoryService();
    private voteService: VoteService;

    public async getPostById(postId: string, userId: string | undefined): Promise<Post> {
        return Post.findByPk(postId, {include: [Vote, User]}).then(dbPost => {
            if (dbPost) {
                this.setScore(dbPost);
                dbPost = this.addVotingStatus(dbPost, userId);
                return Promise.resolve(dbPost);
            } else {
                return Promise.reject({message: 'no post with ID ' + postId + ' exists'});
            }
        });
    }

    private setScore(post: Post) {
        let score = 0;
        // @ts-ignore
        for (const vote of post.Votes) {
            if (vote.upvote === 1) {
                score += 1;
            } else {
                score -= 1;
            }
        }
        // @ts-ignore
        post.setDataValue('score', score);
    }

    public async getAll(sortBy: string, userId: string | undefined): Promise<Post[]> {
        return  Post.findAll({
            attributes: ['postId', 'title', 'image', 'text', 'category', 'UserUserId'],
            include: [Vote, User]
        }).then(dbPosts => {
            const postsWithScore: Post[] = [];
            for (let dbPost of dbPosts) {
                this.setScore(dbPost);
                dbPost = this.addVotingStatus(dbPost, userId);
                postsWithScore.push(dbPost);
            }
            return postsWithScore.sort( (postA, postB) => {
                if (sortBy === '1') {
                    // @ts-ignore
                    return postA.getDataValue('score') - postB.getDataValue('score');
                } else {
                    return postB.postId - postA.postId;
                }
            });
        });
    }

    public async upvote(postId: number, userId: number): Promise<Post> {
        const hasVoted = await this.voteService.alreadyVoted(postId, userId, true);
        if (hasVoted) {
            return Promise.reject({message: 'user ' + userId + ' has already upvoted on post ' + postId});
        } else {
            await this.voteService.upvote(postId, userId);
            return this.getPostById('' + postId, '' + userId);
        }
    }

    public async downvote(postId: number, userId: number): Promise<Post> {
        const hasVoted = await this.voteService.alreadyVoted(postId, userId, false);

        if (hasVoted) {
            return Promise.reject({message: 'user ' + userId + ' has already downvoted on post ' + postId});
        } else {
            await this.voteService.downvote(postId, userId);
            return this.getPostById('' + postId, '' + userId);
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
                return dbPost.save().then(() => this.getPostById('' + modifiedPost.postId, '' + userId));
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
        return createdPost.save().then(() => this.getPostById('' + createdPost.postId, '' + userId));
    }

    private addVotingStatus(post: Post, userId: string | undefined) {
        // @ts-ignore
        post.setDataValue('votingStatus', 'not voted');
        if (userId === 'undefined') { return post; }
        const userIdAsInt = parseInt(userId, 10);
        let i = 0;

        // @ts-ignore
        while (!(post.getDataValue('votingStatus') !== 'not voted')  && i < post.Votes.length) {
            // @ts-ignore
            if (post.Votes[i].upvote === 1 && post.Votes[i].UserUserId === userIdAsInt) {
                // @ts-ignore
                post.setDataValue('votingStatus', 'upvoted');
                // @ts-ignore
            } else if (post.Votes[i].upvote === -1 && post.Votes[i].UserUserId === userIdAsInt) {
                // @ts-ignore
                post.setDataValue('votingStatus', 'downvoted');
            }
            i++;
        }

        return post;
    }

    constructor() {
        this.voteService = new VoteService();
    }
}
