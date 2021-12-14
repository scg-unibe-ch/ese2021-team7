import { IPermission } from "./IPermission";
import { PermissionType } from "./permission-type";

/**
 * Defines access permissions for all sensitive components.
 */
export class AccessPermission implements IPermission {
  constructor(
    public accessPurchaseForm: boolean,
    public accessAdminDashBoard: boolean,
    public accessCategoryForm: boolean,
    public accessCategoryList: boolean,
    public accessProductForm: boolean,
    public accessHome: boolean,
    public accessFeed: boolean,
    public accessShop: boolean
  ){}

  //interface method implementation
  checkPermissions(permissionType: PermissionType): boolean {
    switch(permissionType) {
      case PermissionType.AccessPurchaseForm:
        return this.accessPurchaseForm;
      case PermissionType.AccessAdminDashBoard:
        return this.accessAdminDashBoard;
      case PermissionType.AccessCategoryForm:
        return this.accessCategoryForm;
      case PermissionType.AccessCategoryList:
        return this.accessCategoryList;
      case PermissionType.AccessProductForm:
        return this.accessProductForm;
      case PermissionType.AccessHome:
        return this.accessHome;
      case PermissionType.AccessFeed:
        return this.accessFeed;
      case PermissionType.AccessShop:
        return this.accessShop;
      default:
        return false;
    }
  }
}
