import { PermissionType } from "./permission-type";

/**
 * Implemented by different permission objects.
 */
export interface IPermission {

  /**
   * Checks if the permission for a given permission type is true/false;
   *
   * @param permissionType
   */
  checkPermissions(permissionType: PermissionType): boolean;
}
