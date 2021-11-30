import { Model, Sequelize, DataTypes } from 'sequelize';
import { User } from './user.model';
import { Product } from './product.model';
import {OrderController} from '../controllers/order.controller';

export interface OrderAttributes {
    orderId: number;
    firstName: string;
    lastName: string;
    street: string;
    houseNr: string;
    zip: string;
    city: string;
    paymentOption: number;
    orderStatus: number;
    user: number;
}

export class Order extends Model<OrderAttributes> implements OrderAttributes {
    orderId!: number;
    firstName: string;
    lastName: string;
    street: string;
    houseNr: string;
    zip: string;
    city: string;
    paymentOption!: number;
    orderStatus!: number;
    user!: number;

    public static initialize(sequelize: Sequelize) {
        Order.init({
            orderId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            firstName: {
                type: DataTypes.STRING
            },
            lastName: {
                type: DataTypes.STRING
            },
            street: {
                type: DataTypes.STRING
            },
            houseNr: {
                type: DataTypes.STRING
            },
            zip: {
                type: DataTypes.STRING
            },
            city: {
                type: DataTypes.STRING
            },
            paymentOption: {
                type: DataTypes.INTEGER
            },
            orderStatus: {
                type: DataTypes.INTEGER
            },
            user: {
                type: DataTypes.INTEGER
            }
        },
            {
                sequelize,
                tableName: 'order'
            });
    }

    public static createAssociations() {
        Order.belongsTo(Product);
        Product.hasMany(Order);
    }
}
