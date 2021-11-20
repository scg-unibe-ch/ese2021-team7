import { Vote, VoteAttributes } from '../models/vote.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

export class VoteService {
    public async alreadyVoted(postId: number, userId: number): Promise<boolean> {
        const {count, rows} = await Vote.findAndCountAll({
            where: {
                // @ts-ignore
                'postpostId': postId,
                'useruserId': userId
            },
            include: [Post, User]
        });

        return count === 1;
    }

    public async upvote(postId: number, userId: number): Promise<boolean> {
        const hasVoted = await this.alreadyVoted(postId, userId);

        const post = await Post.findByPk(postId.toString());
        const user = await User.findByPk(userId.toString());

        if (hasVoted) {
            return false;
        } else {
            const createdVote = await Vote.create({upvote: true} as VoteAttributes);
            // FIXME: Solve problem that associations cannot be set
            createdVote.setPost(post);
            createdVote.setUser(user);

            return true;
        }
    }

    public async downvote(postId: number, userId: number): Promise<boolean> {
        let hasVoted: boolean;
        // tslint:disable-next-line:no-shadowed-variable
        this.alreadyVoted(postId, userId).then(function (vote) {
            hasVoted = vote;
        });

        const post = await Post.findByPk(postId.toString());
        const user = await User.findByPk(userId.toString());

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
