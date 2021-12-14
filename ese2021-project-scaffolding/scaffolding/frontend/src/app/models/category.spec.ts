import {Category} from './category';
import {CategoryType} from "./category-type";

describe('Category', () => {
  it('should create an instance', () => {
    expect(new Category(0,'', CategoryType.Post, '')).toBeTruthy();
    expect(new Category(0,'', CategoryType.Product, '')).toBeTruthy();

  });
});
