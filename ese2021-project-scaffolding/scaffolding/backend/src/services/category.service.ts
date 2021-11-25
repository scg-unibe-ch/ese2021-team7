import {Category} from '../models/category.model';

export enum CategoryType {
    POST_CATEGORY,
    PRODUCT_CATEGORY
}

export class CategoryService {

    public async getAll(): Promise<Category[]> {
        return Category.findAll();
    }

    /**
     * return whether the specified category (id) is a valid category for the specified type
     */
    public async categoryIsValid(id: number, type: number): Promise<boolean> {
        if (id == null || type == null) {
            return Promise.resolve(false);
        } else {
            return Category.findByPk(id).then(dbCategory => {
                return dbCategory && dbCategory.type === type;
            });
        }
    }

    public async getById(categoryId: string): Promise<Category> {
        return Category.findByPk(categoryId).then(dbCategory => {
            if (dbCategory) {
                return Promise.resolve(dbCategory);
            } else {
                return Promise.reject({message: 'no category with ID ' + categoryId + ' exists'});
            }
        });
    }

    public async createCategory(category: Category): Promise<Category> {
        if (category.type !== CategoryType.POST_CATEGORY && category.type !== CategoryType.PRODUCT_CATEGORY) {
            return Promise.reject({message: 'invalid category type: ' + category.type});
        }
        return Category.create(category);
    }

    public async modifyCategory(modifiedCategory: Category): Promise<Category> {
        return Category.findByPk(modifiedCategory.categoryId).then(async dbCategory => {
            if (dbCategory) {
                dbCategory.name = modifiedCategory.name;
                return dbCategory.save().then(updatedCategory => Promise.resolve(updatedCategory));
            } else {
                return Promise.reject({message: 'no category with ID ' + modifiedCategory.categoryId + ' exists'});
            }
        });
    }

}
