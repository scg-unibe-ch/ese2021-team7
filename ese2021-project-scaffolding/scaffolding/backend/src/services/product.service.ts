import {Product} from '../models/product.model';
import {CategoryService, CategoryType} from './category.service';
import {OrderStatus} from './oder.service';
import {Order} from '../models/order.model';

export class ProductService {

    private categoryService = new CategoryService();

    private setAvailability(product: Product) {
        let available = true;
        // @ts-ignore
        for (const order of product.Orders) {
            if (order.orderStatus === OrderStatus.PENDNIG || order.orderStatus === OrderStatus.SHIPPED) {
                available = false;
            }
        }
        // @ts-ignore
        product.setDataValue('isAvailable', available);
    }

    public async getProductById(productId: string): Promise<Product> {
        return Product.findByPk(productId, {include: Order}).then(dbProduct => {
            if (dbProduct) {
                this.setAvailability(dbProduct);
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
        }).then(dbProducts => {
            const postsWithOrderStatus: Product[] = [];
            for (const dbProduct of dbProducts) {
                this.setAvailability(dbProduct);
                postsWithOrderStatus.push(dbProduct);
            }
            return postsWithOrderStatus;
        });
    }

    public async getAll(): Promise<Product[]> {
        return Product.findAll({include: Order}).then(dbProducts => {
            const postsWithOrderStatus: Product[] = [];
            for (const dbProduct of dbProducts) {
                this.setAvailability(dbProduct);
                postsWithOrderStatus.push(dbProduct);
            }
            return Promise.resolve(postsWithOrderStatus);
        });
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
                return dbProduct.save().then(() => this.getProductById('' + modifiedProduct.productId));
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
        return Product.create(product).then(createdProduct => this.getProductById('' + createdProduct.productId));
    }
}
