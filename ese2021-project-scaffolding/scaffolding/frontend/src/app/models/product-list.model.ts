import { Product } from './product.model';

export class ProductList {

  constructor(
    public productListId: number,
    public name: string,
    public products: Product[]
  ) {}
}
