import { Category } from "./category";

/**
 * Product in shop.
 */
export class Product {

  constructor(
    public productId: number,
    public title: string,
    public description: string,
    public image: string, // string containing the url to the image
    public price: number,
    public category: Category,
    public sold: boolean // 0 if not sold, 1 if sold (i.e. if added to an order)
  ) {}
}
