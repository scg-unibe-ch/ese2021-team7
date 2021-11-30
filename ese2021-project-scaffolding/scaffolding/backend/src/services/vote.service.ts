import { Vote, VoteAttributes } from '../models/vote.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

export class VoteService {
    public async alreadyVoted(postId: number, userId: number, upvote: boolean): Promise<boolean> {
        const upvoteValue = (upvote) ? 1 : -1;
        const {count, rows} = await Vote.findAndCountAll({
            where: {
                // @ts-ignore
                'postpostId': postId,
                'useruserId': userId,
                'upvote': upvoteValue
            },
            include: [Post, User]
        });

        return count === 1;
    }

    public async upvote(postId: number, userId: number): Promise<boolean> {
        const hasVoted = await this.alreadyVoted(postId, userId, true);
        // If a user has downvoted on said post, this downvote is to be deleted
        if (await this.alreadyVoted(postId, userId, false)) {
            await Vote.destroy({
                where: {
                    // @ts-ignore
                    'postpostId': postId,
                    'useruserId': userId,
                    'upvote': -1
                },
                force: true
            });
        }

        const post = await Post.findByPk(postId.toString());
        const user = await User.findByPk(userId.toString());

        if (hasVoted) {
            return false;
        } else {
            const createdVote = await Vote.create({upvote: 1} as VoteAttributes);
            // @ts-ignore
            createdVote.setPost(post);
            // @ts-ignore
            createdVote.setUser(user);

            return true;
        }
    }

    public async downvote(postId: number, userId: number): Promise<boolean> {
        const hasVoted = await this.alreadyVoted(postId, userId, false);
        // If a user has downvoted on said post, this downvote is to be deleted
        if (await this.alreadyVoted(postId, userId, true)) {
            await Vote.destroy({
                where: {
                    // @ts-ignore
                    'postpostId': postId,
                    'useruserId': userId,
                    'upvote': 1
                },
                force: true
            });
        }

        const post = await Post.findByPk(postId.toString());
        const user = await User.findByPk(userId.toString());

        if (hasVoted) {
            return false;
        } else {
            const createdVote = await Vote.create({upvote: -1} as VoteAttributes);
            // @ts-ignore
            createdVote.setPost(post);
            // @ts-ignore
            createdVote.setUser(user);

            return true;
        }
    }
}
