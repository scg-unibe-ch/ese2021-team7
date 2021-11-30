export class OrderToDisplay {

  constructor(
    public orderId: number,
    public customer: number, // userId of the user which places the order
    public productId: number, // to indicate which product is sold
    public productName: string,
    public productImage: string,
    public productDescription: string,
    public productPrice: number,
    public firstName: string,
    public lastName: string,
    public street: string,
    public houseNumber: string,
    public zipCode: string,
    public city: string,
    public paymentMethod: string,
    public orderStatus: number // pending = initial state, shipped/done = if admin proceeded it, cancelled = if user deletes it --> if oder is shipped or cancelled, it is deleted
  ) {}
}
