import { Vote } from '../models/vote.model';
import { PostService } from './post.service';

import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { UserService } from './user.service';

export class VoteService {
    private userService: UserService = new UserService();
    private postService: PostService = new PostService();

    public async alreadyVoted(postId: number, userId: number): Promise<boolean> {
        const {count, rows} = await Vote.findAndCountAll({
            where: {
                // @ts-ignore
                'posts.postId': postId,
                'users.userId': userId
            },
            include: [
                {model: Post, as: Post.tableName},
                {model: User, as: User.tableName}
            ]
        });

        return count === 1;
    }

    public upvote(postId: number, userId: number): boolean {
        let hasVoted: boolean;
        // tslint:disable-next-line:no-shadowed-variable
        this.alreadyVoted(postId, userId).then(function (vote) {
            hasVoted = vote;
        });

        let post: Post;
        this.postService.getPostById(postId.toString()).then(function (fetchedPost) {
            post = fetchedPost;
        });

        let user: User;
        this.userService.getById(userId.toString()).then(function (fetchedUser) {
            user = fetchedUser;
        });

        // @ts-ignore
        const vote: Vote = {upvote: true};
        let createdVote: Vote;

        if (hasVoted) {
            return false;
        } else {
            Vote.create(vote).then(function (newVote) {
                createdVote = newVote;
            });
            // @ts-ignore
            createdVote.setPost(post);
            // @ts-ignore
            createdVote.setUser(user);

            return true;
        }
    }

    public downvote(postId: number, userId: number): boolean {
        let hasVoted: boolean;
        // tslint:disable-next-line:no-shadowed-variable
        this.alreadyVoted(postId, userId).then(function (vote) {
            hasVoted = vote;
        });

        let post: Post;
        this.postService.getPostById(postId.toString()).then(function (fetchedPost) {
            post = fetchedPost;
        });

        let user: User;
        this.userService.getById(userId.toString()).then(function (fetchedUser) {
            user = fetchedUser;
        });

        // @ts-ignore
        const vote: Vote = {upvote: false};
        let createdVote: Vote;

        if (hasVoted) {
            return false;
        } else {
            Vote.create(vote).then(function (newVote) {
                createdVote = newVote;
            });
            // @ts-ignore
            createdVote.setPost(post);
            // @ts-ignore
            createdVote.setUser(user);

            return true;
        }
    }
}
