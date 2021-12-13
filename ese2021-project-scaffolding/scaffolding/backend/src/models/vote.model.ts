import {DataTypes, Model, Sequelize} from 'sequelize';
import {Post} from './post.model';
import {User} from './user.model';

export interface VoteAttributes {
    voteId: number;
    upvote: number;
}

export class Vote extends Model<VoteAttributes> implements VoteAttributes {
    voteId!: number;
    upvote!: number;

    public static initialize(sequelize: Sequelize) {
        Vote.init({
                voteId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                upvote: {
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                tableName: 'vote'
            });
    }

    public static createAssociations() {
        Post.hasMany(Vote);
        Vote.belongsTo(Post);
        User.hasMany(Vote);
        Vote.belongsTo(User);
    }
}
