import { Injectable } from '@angular/core';
import { AccessPermission } from '../models/access-permission';
import { FeaturePermission } from '../models/feature-permission';
import { PermissionType } from '../models/permission-type';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { VotingState } from '../models/voting-state';

@Injectable({
  providedIn: 'root'
})
/**
 * Manges permissions settings (between guest, user, admin) for all components.
 */
export class PermissionService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  private guestPermissions = ["AccessFeed", "AccessHome", "AccessShop"];
  private adminAccessPermissions: AccessPermission =  new AccessPermission(
    false, // accessPurchaseForm
    true, // accessAdminDashBoard
    true, // accessCategoryForm
    true, // accessCategoryList
    true, // accessProductForm
    true, // accessHome
    true, // accessFeed
    true //accessShop
  );
  private userAccessPermissions: AccessPermission = new AccessPermission(
    true, // accessPurchaseForm
    false, // accessAdminDashBoard
    false, // accessCategoryForm
    false, // accessCategoryList
    false, // accessProductForm
    true, // accessHome
    true, // accessFeed
    true //accessShop
  );

  private adminFeaturePermissions: FeaturePermission = new FeaturePermission(
    true, //productUpdateDelete
    false, // purchaseProduct
    true, // addProduct
    false // createPost
  );

  private userFeaturePermissions: FeaturePermission = new FeaturePermission(
    false, //productUpdateDelete
    true, // purchaseProduct
    false, // addProduct
    true // createPost
  );

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor() { }

  /*******************************************************************************************************************
   * ACCESS PERMISSIONS
   ******************************************************************************************************************/

  /**
   * Returns access permissions for admin.
   */
  getAdminAccessPermissions(): AccessPermission {
    return this.adminAccessPermissions;
  }

  /**
   * Returns access permissions for user.
   */
  getUserAccessPermissions(): AccessPermission {
    return this.userAccessPermissions;
  }

  /**
   * Checks if a given guest, user, or admin has the permission to access a given component.
   *
   * @param loggedIn: guest = not looged in
   * @param user: given user or admin
   * @param permissionToAccess: type of permission (= access to which component)
   */
  evaluateAccessPermissions(loggedIn: boolean, user: User | undefined, permissionToAccess: PermissionType): boolean {
    if(user == undefined) {
      if(!loggedIn){
        if(this.guestPermissions.includes(permissionToAccess)) return true; //check guest array
        else return false;
      } else return false;
    } else {
      return user.accessPermissions.checkPermissions(permissionToAccess); //otherwise evaluate
    }
  }

  /*******************************************************************************************************************
   * FEATURE PERMISSIONS
   ******************************************************************************************************************/

  getAdminFeaturePermissions(): FeaturePermission {
    return this.adminFeaturePermissions;
  }

  getUserFeaturePermissions(): FeaturePermission {
    return this.userFeaturePermissions;
  }

  /*******************************************************************************************************************
   * POST PERMISSIONS
   ******************************************************************************************************************/

  /**
   * Checks if given guest, user, admin has permission to update/delete given post.
   *
   * @param loggedIn: not logged in = guest
   * @param user: user or admin
   * @param post: given post
   */
  checkPermissionsPostUpdateAndDelete(loggedIn: boolean, user: User | undefined, post: Post): boolean {
    // set true if user is admin or if user is creator of post
    if(user == undefined ) return false;
    else if (loggedIn) {
      if (user.isAdmin) return true;
      else if (user.userId == post.CreationUser) return true;
      else return false;
    }
    else return false;
  }

  /**
   * Checks if for given guest, user, admin voting buttons are shown for a given post
   *
   * @param loggedIn: not logged in = guest
   * @param user: user or admin
   * @param post: given post
   */
  checkPermissionsShowVotingButtons(loggedIn: boolean, user: User | undefined, post: Post): boolean {
    // set true only if logged in and user is not creator
    if(user == undefined ) return false;
    else if (loggedIn && !user.isAdmin && user.userId != post.CreationUser) return true;
    else return false;
  }

  /**
   * Checks if given guest, user, admin has permission to upvote given post.
   *
   * @param loggedIn: not logged in = guest
   * @param user: user or admin
   * @param post: given post
   */
  checkPermissionsUpvote(loggedIn: boolean, user: User | undefined, post: Post): boolean {
    if(user == undefined) return false;
    else if (loggedIn && !user?.isAdmin && user?.userId != post.CreationUser) {
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

  /**
   * Checks if given guest, user, admin has permission to downvote given post.
   *
   * @param loggedIn: not logged in = guest
   * @param user: user or admin
   * @param post: given post
   */
  checkPermissionsDownvote(loggedIn: boolean, user: User | undefined, post: Post): boolean {
    if (user == undefined) return false;
    else if (loggedIn && !user?.isAdmin && user?.userId != post.CreationUser) {
      switch (post.votingState) {
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
    } else return false;
  }



}
