import {DataTypes, Model, Sequelize} from 'sequelize';

export interface CategoryAttributes {
    categoryId: number;
    name: string;
    type: number;
}

export class Category extends Model<CategoryAttributes> implements CategoryAttributes {
    categoryId!: number;
    name: string;
    type: number;

    public static initialize(sequelize: Sequelize) {
        Category.init({
                categoryId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING
                },
                type: {
                    type: DataTypes.INTEGER
                },
            },
            {
                sequelize,
                tableName: 'category'
            });
    }

}
