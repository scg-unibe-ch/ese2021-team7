/**
 * Backend request parameters for "product/create" or "product/modify" request.
 */
export interface ProductRequestParams {
  title: string,
  description: string,
  image: string,
  price: number,
  productCategory: number,
  productId?: number
}
