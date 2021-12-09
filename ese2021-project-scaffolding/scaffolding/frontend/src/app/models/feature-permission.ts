import { IPermission } from "./IPermission";
import { PermissionType } from "./permission-type";

/**
 * Defines permission to different features.
 */
export class FeaturePermission implements IPermission {

  constructor(
    public productUpdateDelete: boolean,
    public purchaseProduct: boolean,
    public addProduct: boolean,
    public createPost: boolean) {
  }

  // interface method implementation
  checkPermissions(permissionType: PermissionType): boolean {
    switch(permissionType) {
      case PermissionType.ProductUpdateDelete:
        return this.productUpdateDelete;
        break;
      case PermissionType.PurchaseProduct:
        return this.purchaseProduct;
        break;
      case PermissionType.AddProduct:
        return this.addProduct;
        break;
      case PermissionType.CreatePost:
        return this.createPost;
        break;
      default:
        return false;
        break;
    }
  }
}
