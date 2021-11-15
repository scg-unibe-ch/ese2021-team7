import { Model, Sequelize, DataTypes } from 'sequelize';

export interface ProductAttributes {
    productId: number;
    title: string;
    image: string;
    description: string;
    price: number;
    productCategory;
}

export class Product extends Model<ProductAttributes> implements ProductAttributes {
    productId!: number;
    title!: string;
    image!: string;
    description!: string;
    price!: number;
    productCategory!: number;

    public static initialize(sequelize: Sequelize) {
        Product.init({
            productId: {
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
            description: {
                type: DataTypes.STRING
            },
            price: {
                type: DataTypes.DECIMAL
            },
            productCategory: {
                type: DataTypes.INTEGER
            }
        },
            {
                sequelize,
                tableName: 'product'
            });
    }
}
