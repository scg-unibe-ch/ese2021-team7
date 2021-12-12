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
        break;
      case PermissionType.AccessAdminDashBoard:
        return this.accessAdminDashBoard;
        break;
      case PermissionType.AccessCategoryForm:
        return this.accessCategoryForm;
        break;
      case PermissionType.AccessCategoryList:
        return this.accessCategoryList;
        break;
      case PermissionType.AccessProductForm:
        return this.accessProductForm;
        break;
      case PermissionType.AccessHome:
        return this.accessHome;
        break;
      case PermissionType.AccessFeed:
        return this.accessFeed;
        break;
      case PermissionType.AccessShop:
        return this.accessShop;
        break;
      default:
        return false;
        break;
    }
  }
}
