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
import { ProductService } from '../services/product.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { BaseFormComponent } from '../base-form/base-form.component';
import { FormType } from '../models/form-type';
import { ProductFormService } from '../services/product-form.service';
import { ShopService } from '../services/shop.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent extends BaseFormComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/
  // overrides parent variables
  protected formType = FormType.Product;
  form: FormGroup = new FormGroup({});
  requestType = "";

  //used to decide wheter update or create form
  isUpdate: boolean = false;
  isCreate: boolean = false;

  // used because of asyn call
  isLoading: boolean = false;

  // array with product categories
  productCategories: Category[] = [];

  // User
  loggedIn = false;
  currentUser : User = new User(0, '', '', false,'','','','','','','','','');

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(public fb: FormBuilder,
              public userService: UserService,
              public productFormService: ProductFormService,
              public route: ActivatedRoute,
              public router: Router,
              private categoryService: CategoryService,
              private shopService: ShopService,
              private dialogRef: MatDialogRef<ProductFormComponent>,
              private permissionService: PermissionService,
              @Inject(MAT_DIALOG_DATA) public dialogData: {isUpdate: boolean, isCreate: boolean, productId: number}) {
    super(fb, productFormService, router, route);
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
    this.userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.userService.user$.subscribe(res => this.currentUser = res);
    //get current values
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();

    if(!this.permissionService.checkPermissionsToAccessProductForm(this.loggedIn, this.currentUser)){
      if(this.dialogRef){
        this.dialogRef.close();
      }
    }


    this.setUpFormType();
  }

  /*******************************************************************************************************************
   * USER FLOW
   ******************************************************************************************************************/

  /**
   * Closes dialog box.
   * Overrides parents method.
   *
   * @param route: not used
   * @param queryParams: not used
   */
  reRouteAfterSuccess(route: string, queryParams?: any): void {
    this.dialogRef.close();
  }

  /**
   * Closes dialog box if user clicks on "Discard" button.
   */
  discardChanges(): void {
    this.dialogRef.close(); //closes dialog box
  }

  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************

  /**
   * Checks whether form is used to create or update product.
   *
   * Initializes form with the right parameters.
   *
   * In case of update, gets product from ShopService and displays it as presets.
   */
  setUpFormType(): void{
    if(this.dialogData.isUpdate){
      //set parameters
      this.isUpdate = true;
      this.isCreate= false;
      this.isLoading = true;
      this.requestType = "product/modify";
      //get product
      this.shopService.getProductByIdAsObservable(this.dialogData.productId).
      subscribe(product => {
        this.initializeForm(product); //initialize form with preset
        this.isLoading = false;
        console.log(this.form);
      });
    } else if(this.dialogData.isCreate) {
      this.isUpdate = false;
      this.isCreate= true;
      this.requestType = "product/create";
      this.initializeForm(); //initialize form empty
      console.log(this.form);
    }
  }

}
