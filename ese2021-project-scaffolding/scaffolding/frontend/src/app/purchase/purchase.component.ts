import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent extends BaseFormComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

    //overrides
  form: FormGroup = new FormGroup({});
  protected requestType = "order/create";
  protected routeAfterSuccess = "shop";
  protected routeAfterDiscard = "shop";


  // to stop DOM form from loading to early
  isLoading: boolean = false;

  isSubmitted: boolean = false;

  //purchaseForm: FormGroup | undefined;

  //productId: number | undefined;

  // product User buys
  product = new Product(0, "", "", "", 0, new Category(0, "undefined", 0, "undefined"), false);

  //User
  currentUser: User = new User(0, "", "", false, "", "", "", "", "", "", "", "", "");
  loggedIn: boolean = false;


  // presets for form creation, needs User and Product
  static PreSet = class {
    constructor(public presetUser: User,
                public presetProduct: Product) {
    }
  };

  //array with product categories
  productCategories: Category[] = [];

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(public fb: FormBuilder,
              public userService: UserService,
              public route: ActivatedRoute,
              public router: Router,
              private categoryService: CategoryService,
              public purchaseFormSerivce: PurchaseFormService,
              private shopService: ShopService,
              private permissionService: PermissionService) {
    super(fb, purchaseFormSerivce, router, route);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    //listener for product categories
    this.categoryService.productCategories$.subscribe(res => this.productCategories = res);
    //current value of product categories
    this.productCategories = this.categoryService.getProductCategories();

    // Listen for changes
    this.userService.loggedIn$.subscribe(res => {
      this.loggedIn = res;
    });
    this.userService.user$.subscribe(res => {
      this.currentUser = res;
    })
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();

    if (this.permissionService.permissionToAccessPurchaseForm(this.loggedIn, this.currentUser)) {
      this.isLoading = true; //set loading flag
      let productId = 0;
      this.route.queryParams.subscribe(params => {
        productId = params['productId'];
      });
      if (productId != null) {
        this.shopService.getProductByIdAsObservable(productId).subscribe(product => {
          this.product = this.shopService.createProductFromBackendResponse(product); // create Product object
          this.initializeForm(new PurchaseComponent.PreSet(this.currentUser, this.product)); //initialize form with presets
          this.isLoading = false;
        });
      }

    } else {
      if (this.currentUser.isAdmin) this.router.navigate(['/shop']);
      else this.router.navigate(['/login'])
    }
  }

}

