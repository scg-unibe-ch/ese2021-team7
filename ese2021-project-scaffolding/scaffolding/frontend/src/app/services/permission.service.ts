import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { VotingState } from '../models/voting-state';

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

  /*******************************************************************************************************************
   * ADMIN DASHBOARD  PERMISSIONS
   ******************************************************************************************************************/

  /**
   * Checks if user is admin, otherwise re-routes.
   */
  checkPermissionToAccessAdminDashboard(loggedIn: boolean, user: User): boolean {
    if (loggedIn){
      if (user.isAdmin) return true;
      else return false;
    }
    else return false;
  }

  /*******************************************************************************************************************
   * CATEGORY FORM
   ******************************************************************************************************************/

  checkPermissionsToAccessCategoryForm(loggedIn: boolean, user: User): boolean {
    if (loggedIn){
      if (user.isAdmin) return true;
      else return false;
    }
    else return false;
  }


  /*******************************************************************************************************************
   * CATEGORY LIST
   ******************************************************************************************************************/

  checkPermissionsToAccessCategoryList(loggedIn: boolean, user: User): boolean {
    if (loggedIn){
      if (user.isAdmin) return true;
      else return false;
    }
    else return false;
  }

  /*******************************************************************************************************************
   * PRODUCT FORM
   ******************************************************************************************************************/

  checkPermissionsToAccessProductForm(loggedIn: boolean, user: User): boolean {
    if (loggedIn){
      if (user.isAdmin) return true;
      else return false;
    }
    else return false;
  }

  /*******************************************************************************************************************
   * POST PERMISSIONS
   ******************************************************************************************************************/

  checkPermissionsProductUpdateAndDelete(loggedIn: boolean, user: User, post: Post): boolean {
    // set true if user is admin or if user is creator of post
    if (loggedIn) {
      if (user.isAdmin) return true;
      else if (user.userId == post.CreationUser) return true;
      else return false;
    }
    else return false;
  }

  checkPermissionsShowVotingButtons(loggedIn: boolean, user: User, post: Post): boolean {
    // set true only if logged in and user is not creator
    if (loggedIn && !user.isAdmin && user.userId != post.CreationUser) return true;
    else return false;
  }

  checkPermissionsUpvote(loggedIn: boolean, user: User, post: Post): boolean {
    if (loggedIn && !user.isAdmin && user.userId != post.CreationUser) {
      switch (post.votingState){
        case VotingState.NotVoted: {
          return true;
          break;
        }
        case VotingState.Upvoted: {
          return false;
          break;
        }
        case VotingState.Downvoted: {
          return true;
          break;
        }
        default: {
         return false;
        }
      }
    }
    else return false;
  }

  checkPermissionsDownvote(loggedIn: boolean, user: User, post: Post): boolean {
    if (loggedIn && !user.isAdmin && user.userId != post.CreationUser) {
      switch (post.votingState){
        case VotingState.NotVoted: {
          return true;
          break;
        }
        case VotingState.Upvoted: {
          return true;
          break;
        }
        case VotingState.Downvoted: {
          return false;
          break;
        }
        default: {
          return false;
        }
      }
    }
    else return false;
  }

}
