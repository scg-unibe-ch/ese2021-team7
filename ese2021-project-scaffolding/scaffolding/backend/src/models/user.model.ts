import {DataTypes, Model, Optional, Sequelize} from 'sequelize';
import {Post} from './post.model';

export interface UserAttributes {
    userId: number;
    userName: string;
    password: string;
    admin: boolean;
    house: number;
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    houseNumber: string;
    zipCode: string;
    city: string;
    birthday: Date;
    phoneNumber: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    userId!: number;
    userName!: string;
    password!: string;
    admin!: boolean;
    house: number;
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    houseNumber: string;
    zipCode: string;
    city: string;
    birthday: Date;
    phoneNumber: string;

    public static initialize(sequelize: Sequelize) {
        User.init({
                userId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                userName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                admin: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                firstName: {
                    type: DataTypes.STRING,
                },
                house: {
                    type: DataTypes.INTEGER,
                },
                lastName: {
                    type: DataTypes.STRING,
                },
                email: {
                    type: DataTypes.STRING,
                },
                street: {
                    type: DataTypes.STRING,
                },
                houseNumber: {
                    type: DataTypes.STRING,
                },
                zipCode: {
                    type: DataTypes.STRING,
                },
                city: {
                    type: DataTypes.STRING,
                },
                birthday: {
                    type: DataTypes.DATE,
                },
                phoneNumber: {
                    type: DataTypes.STRING,
                }
            },
            {
                sequelize,
                tableName: 'users'
            }
        );
    }

    public static createAssociations() {
        User.hasMany(Post, {
            as: 'post',
            foreignKey: 'userId'
        });
    }
}
