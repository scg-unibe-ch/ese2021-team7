import { Component, Injector, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {FormControl, FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl, FormGroupDirective} from '@angular/forms';
import { Product } from '../models/product.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { BaseFormComponent } from '../base-form/base-form.component';
import { PurchaseFormService } from '../services/purchase-form.service';
import { ShopService } from '../services/shop.service';
import { PermissionService } from '../services/permission.service';
import { AccessPermission } from '../models/access-permission';
import { PermissionType } from '../models/permission-type';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent extends BaseFormComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  //overrides BaseForm
  form: FormGroup = new FormGroup({});
  protected requestType = "order/create";
  protected routeAfterSuccess = "shop";
  protected routeAfterDiscard = "shop";

  // overrides Base component
  permissionToAccess = PermissionType.AccessPurchaseForm;
  routeIfNoAccess: string = "/shop";

  // to stop DOM form from loading to early
  isLoading: boolean = false;

  isSubmitted: boolean = false;

  // product User buys
  product = new Product(0, "", "", "", 0, new Category(0, "undefined", 0, "undefined"), false);


  // presets for form creation, needs User and Product
  static PreSet = class {
    constructor(public presetUser: User | undefined,
                public presetProduct: Product) {
    }
  };

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(public fb: FormBuilder,
              public route: ActivatedRoute,
              public purchaseFormSerivce: PurchaseFormService,
              private shopService: ShopService,
              public injector: Injector) {
    super(purchaseFormSerivce, injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    super.initializeUser();
    //super.evaluateAccessPermissions();
    super.initializeCategories();

      this.isLoading = true; //set loading flag
      let productId = 0;
      this.route.queryParams.subscribe(params => {
        productId = params['productId'];
      });
      if (productId != null) {
        if(this.currentUser == undefined) {
          this.router.navigate(['/login']);
        }
        else {
          this.shopService.getProductByIdAsObservable(productId).subscribe(product => {
            this.product = this.shopService.createProductFromBackendResponse(product); // create Product object
            this.initializeForm(new PurchaseComponent.PreSet(this.currentUser, this.product)); //initialize form with presets
            this.isLoading = false;
          });
        }
      }
  }

  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/

  /**
   * Override parents method.
   *
   * Submits form to backend and handles re-routing in case of success/error.
   * @param formDirective
   */
  onSubmit(formDirective: FormGroupDirective): void {
    this.formService.sendForm(this.form, this.requestType).subscribe(
      (res: any) => {
        this.isSubmitted = false;
        this.shopService.refresh();
        this.router.navigate(['/shop']);
      },
      (error: any) =>{
        console.log(error);
        this.isSubmitted = false;
      });
  }



  /*******************************************************************************************************************
   * PERMISSIONS
   ******************************************************************************************************************/

  //overrirdes Base Component
  protected reRouteIfNoAccess(route: string, queryParams?: any): void {
    if(this.currentUser == undefined) this.router.navigate(['/login']);
    else if (this.currentUser.isAdmin) {
      this.router.navigate([this.routeIfNoAccess]);
    } else {this.router.navigate(['/login']);}
  }


}

