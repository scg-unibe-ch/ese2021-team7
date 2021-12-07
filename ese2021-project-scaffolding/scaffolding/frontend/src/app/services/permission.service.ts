import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Used to handle permission settings (between guest, user, admin) in all components.
 */
export class PermissionService {

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor() { }

  /*******************************************************************************************************************
   * PRODUCT PERMISSIONS
   ******************************************************************************************************************/

  /**
   * Sets "update/delete" permissions for products.
   *
   * Only admins can update and delete products.
   *
   * @param loggedIn
   * @param user
   */
  evaluateUpdateDeletePermission(loggedIn: boolean, user: User): boolean {
    // set true if user is admin
    if (loggedIn){
      if (user.isAdmin) return true;
      else return false;
    }
    else return false;
  }

  /**
   * Sets "buy" permissions on product.
   *
   * Only user can buy products, not admins. If user is not logged in, returns true as well.
   *
   * @param loggedIn
   * @param user
   */
  evaluateBuyNowPermission(loggedIn: boolean, user: User): boolean {
    // set true if user is admin
    if (loggedIn){
      if (user.isAdmin) {
        return false;
      }
      else {
        return true;
      }
    }
    else return true;
  }

  /*******************************************************************************************************************
   * SHOP PERMISSIONS
   ******************************************************************************************************************/

  /**
   * Checks wheter user is admin and has permission to add new products.
   * Sets parameters accordingly.
   */
  evaluateAddProductPermission(loggedIn: boolean, user: User): boolean {
    // set true if user is admin
    if (loggedIn){
      if (user.isAdmin) return true;
      else return false;
    }
    else return false;
  }

  /*******************************************************************************************************************
   * PURCHASE FORM PERMISSIONS
   ******************************************************************************************************************/

  permissionToAccessPurchaseForm(loggedIn: boolean, user: User): boolean {
    if (loggedIn){
      if (user.isAdmin) return false;
      else return true;
    }
    else return false;
  }


}
