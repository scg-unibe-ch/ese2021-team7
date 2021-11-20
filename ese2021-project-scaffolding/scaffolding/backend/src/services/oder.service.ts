import {Order} from '../models/order.model';
import {User} from '../models/user.model';
import {Product} from '../models/product.model';
import {Post} from '../models/post.model';

enum OrderStatus {
    PENDNIG,
    SHIPPED,
    CANCELLED
}

export class OrderService {

    public async createOrder(order: Order): Promise<Order> {
        const dbUser = await User.findByPk(order.user);
        if (!dbUser) {
            return Promise.reject({message: 'user does not exist'});
        }
        // @ts-ignore
        const productId = order.productId;
        const dbProduct = await Product.findByPk(productId);
        if (!dbProduct) {
            return Promise.reject({message: 'product does not exist'});
        }
        order.orderStatus = OrderStatus.PENDNIG;
        const createdOrder = await Order.create(order);
        // @ts-ignore
        createdOrder.setProduct(dbProduct);
        return createdOrder.save().then(updatedOrder => Promise.resolve(updatedOrder));
    }

    public async getOrderById(orderId: string): Promise<Order> {
        return Order.findByPk(orderId).then(dbOrder => {
            if (dbOrder) {
                return Promise.resolve(dbOrder);
            } else {
                return Promise.reject({message: 'no order with ID ' + orderId + ' exists'});
            }
        });
    }

    public async getOrdersByUser(userId: string): Promise<Order[]> {
        return Order.findAll({where: {user: userId}});
    }

    public async getAll(): Promise<Order[]> {
        return Order.findAll();
    }

    public async cancelOrder(orderId: number): Promise<Order> {
        return Order.findByPk(orderId).then(async dbOrder => {
            if (dbOrder) {
                if (dbOrder.orderStatus === OrderStatus.PENDNIG) {
                    dbOrder.orderStatus = OrderStatus.CANCELLED;
                    return dbOrder.save().then(updatedOrder => Promise.resolve(updatedOrder));
                } else if (dbOrder.orderStatus === OrderStatus.CANCELLED) {
                    return Promise.reject({message: 'order already cancelled'});
                } else if (dbOrder.orderStatus === OrderStatus.SHIPPED) {
                    return Promise.reject({message: 'a shipped order cannot be cancelled'});
                } else {
                    return Promise.reject({message: 'illegal order status: ' + dbOrder.orderStatus});
                }
            } else {
                return Promise.reject({message: 'no order with ID ' + orderId + ' exists'});
            }
        });
    }

    public async shipOrder(orderId: number): Promise<Order> {
        return Order.findByPk(orderId).then(async dbOrder => {
            if (dbOrder) {
                if (dbOrder.orderStatus === OrderStatus.PENDNIG) {
                    dbOrder.orderStatus = OrderStatus.SHIPPED;
                    return dbOrder.save().then(updatedOrder => Promise.resolve(updatedOrder));
                } else if (dbOrder.orderStatus === OrderStatus.CANCELLED) {
                    return Promise.reject({message: 'order is cancelled'});
                } else if (dbOrder.orderStatus === OrderStatus.SHIPPED) {
                    return Promise.reject({message: 'order already shipped'});
                } else {
                    return Promise.reject({message: 'illegal order status: ' + dbOrder.orderStatus});
                }
            } else {
                return Promise.reject({message: 'no order with ID ' + orderId + ' exists'});
            }
        });
    }

    public async modifyOrder(modifiedOrder: Order): Promise<Order> {
        // @ts-ignore
        const productId = modifiedOrder.productId;
        const dbProduct = await Product.findByPk(productId);
        if (!dbProduct) {
            return Promise.reject({message: 'product does not exist'});
        }
        return Order.findByPk(modifiedOrder.orderId).then(async dbOrder => {
            if (dbOrder) {
                dbOrder.deliveryAdress = modifiedOrder.deliveryAdress;
                dbOrder.paymentOption = modifiedOrder.paymentOption;
                dbOrder.orderStatus = modifiedOrder.orderStatus;
                dbOrder.user = modifiedOrder.user;
                // @ts-ignore
                dbOrder.setProduct(dbProduct);
                return dbOrder.save().then(updatedOrder => Promise.resolve(updatedOrder));
            } else {
                return Promise.reject({message: 'no order with ID ' + modifiedOrder.orderId + ' exists'});
            }
        });
    }

    public async deleteOrder(orderId: number): Promise<void> {
        return Order.findByPk(orderId).then(async dbOrder => {
            if (dbOrder) {
                return dbOrder.destroy();
            } else {
                return Promise.reject({message: 'no order with ID ' + orderId + ' exists'});
            }
        });
    }

}
