import { CategoryType } from "./category-type";

export class Category {

  constructor(
  public id: number,
  public name: string,
  public type: CategoryType,
  public typeName: string
  ) {}
}
