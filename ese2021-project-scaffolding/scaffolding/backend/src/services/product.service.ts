import {Product} from '../models/product.model';
import {CategoryService, CategoryType} from './category.service';

export class ProductService {

    private categoryService = new CategoryService();

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
        const categoryIsValid = await this.categoryService.categoryIsValid(modifiedProduct.productCategory, CategoryType.PRODUCT_CATEGORY);
        if (!categoryIsValid) {
            return Promise.reject({message: 'Invalid category: category does not exist, or is of wrong type'});
        }
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
        const categoryIsValid = await this.categoryService.categoryIsValid(product.productCategory, CategoryType.PRODUCT_CATEGORY);
        if (!categoryIsValid) {
            return Promise.reject({message: 'Invalid category: category does not exist, or is of wrong type'});
        }
        return Product.create(product);
    }
}
