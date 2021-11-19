import {Product} from '../models/product.model';

export class ProductService {

    public async getProductById(productId: string): Promise<Product> {
        return Product.findByPk(productId).then(dbProduct => {
            if (dbProduct) {
                return Promise.resolve(dbProduct);
            } else {
                return Promise.reject({message: 'no product with ID ' + productId + ' exists'});
            }
        });
    }

    public async getProductsByProductCategory(requestedProductCategory: string): Promise<Product[]> {
        return Product.findAll({
            where: {
                productCategory: requestedProductCategory
            }
        });
    }

    public async getAll(): Promise<Product[]> {
        return Product.findAll();
    }

    public async modifyProduct(modifiedProduct: Product): Promise<Product> {
        return Product.findByPk(modifiedProduct.productId).then(async dbProduct => {
            if (dbProduct) {
                dbProduct.title = modifiedProduct.title;
                dbProduct.image = modifiedProduct.image;
                dbProduct.description = modifiedProduct.image;
                dbProduct.productCategory = modifiedProduct.productCategory;
                dbProduct.price = modifiedProduct.price;
                return dbProduct.save().then(updatedProduct => Promise.resolve(updatedProduct));
            } else {
                return Promise.reject({message: 'no product with ID ' + modifiedProduct.productId + ' exists'});
            }
        });
    }

    public async deleteProduct(productId: number): Promise<void> {
        return Product.findByPk(productId).then(async dbProduct => {
            if (dbProduct) {
                return dbProduct.destroy();
            } else {
                return Promise.reject({message: 'no product with ID ' + productId + ' exists'});
            }
        });
    }

    public async createProduct(product: Product): Promise<Product> {
        return Product.create(product);
    }
}
