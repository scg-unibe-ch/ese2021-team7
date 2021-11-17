export enum OrderState {
  Pending = 'Pending', // pending = initial state
  Shipped = 'Shipped', // shipped/done = if admin proceeded it
  Cancelled = 'Cancelled' // cancelled = if user deletes it --> if oder is shipped or cancelled, it is deleted

}
