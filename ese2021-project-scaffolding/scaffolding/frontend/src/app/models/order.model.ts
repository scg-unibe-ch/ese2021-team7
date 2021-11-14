import {OrderState} from "../order-list/order/order-state";

export class Order {

  constructor(
    public orderId: number,
    public orderListId: number, // to indicate that it belongs to a certain oder list
    public costumerId: number, // userId of the user which places the order
    public productId: number, // to indicate which product is sold
    public firstName: string,
    public lastName: string,
    public street: string,
    public houseNumber: string,
    public zipCode: string,
    public city: string,
    public paymentMethod: string,
    public state: OrderState // pending = initial state, shipped/done = if admin proceeded it, cancelled = if user deletes it --> if oder is shipped or cancelled, it is deleted
  ) {}
}
