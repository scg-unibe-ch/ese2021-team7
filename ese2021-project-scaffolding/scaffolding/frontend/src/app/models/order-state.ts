export enum OrderState {
  Pending = 0, // pending = initial state
  Shipped = 1, // shipped/done = if admin proceeded it
  Cancelled = 2 // cancelled = if user deletes it --> if oder is shipped or cancelled, it is deleted
}
