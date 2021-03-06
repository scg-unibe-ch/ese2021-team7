import {DataTypes, Model, Sequelize} from 'sequelize';

import {User} from './user.model';

export interface PostAttributes {
    postId: number;
    title: string;
    image: string;
    text: string;
    category: number;
}

export class Post extends Model<PostAttributes> implements PostAttributes {
    postId!: number;
    title!: string;
    image: string;
    text: string;
    category: number;

    public static initialize(sequelize: Sequelize) {
        Post.init({
                postId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                title: {
                    type: DataTypes.STRING
                },
                image: {
                    type: DataTypes.STRING
                },
                text: {
                    type: DataTypes.STRING
                },
                category: {
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                tableName: 'post'
            });
    }

    public static createAssociations() {
        User.hasMany(Post);
        Post.belongsTo(User);
    }
}
