import { Model, Sequelize, DataTypes } from 'sequelize';
import { User } from './user.model';
import { Product } from './product.model';
import {OrderController} from '../controllers/order.controller';

export interface OrderAttributes {
    orderId: number;
    deliveryAdress: string;
    paymentOption: number;
    orderStatus: number;
    user: number;
}

export class Order extends Model<OrderAttributes> implements OrderAttributes {
    orderId!: number;
    deliveryAdress!: string;
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
            deliveryAdress: {
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
