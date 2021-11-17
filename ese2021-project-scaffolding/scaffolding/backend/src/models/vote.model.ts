import { Model, Sequelize, DataTypes } from 'sequelize';
import { Post } from './post.model';
import { User } from './user.model';

export interface VoteAttributes {
    voteId: number;
    upvote: boolean;
}

export class Vote extends Model<VoteAttributes> implements VoteAttributes {
    voteId!: number;
    upvote!: boolean;

    public static initialize(sequelize: Sequelize) {
        Vote.init({
            voteId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            upvote: {
                type: DataTypes.BOOLEAN
            }
        },
            {
                sequelize,
                tableName: 'vote'
            });
    }

    public static createAssociations() {
        Vote.belongsTo(Post);
        Vote.belongsTo(User);
    }
}
