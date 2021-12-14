import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { BaseFormComponent } from '../base-form/base-form.component';
import { FormType } from '../models/form-type';
import { ProductFormService } from '../services/product-form.service';
import { ShopService } from '../services/shop.service';
import { PermissionType } from '../models/permission-type';

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

  //override Base Component
  permissionToAccess = PermissionType.AccessProductForm;
  routeIfNoAccess: string = "/shop";

  //used to decide wheter update or create form
  isUpdate: boolean = false;
  isCreate: boolean = false;

  // used because of asyn call
  isLoading: boolean = false;

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
              public productFormService: ProductFormService,
              public route: ActivatedRoute,
              private shopService: ShopService,
              private dialogRef: MatDialogRef<ProductFormComponent>,
              public injector: Injector,
              @Inject(MAT_DIALOG_DATA) public dialogData: {isUpdate: boolean, isCreate: boolean, productId: number}) {
    super(productFormService, injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    super.ngOnInit();
    super.evaluateAccessPermissions();
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

/*******************************************************************************************************************
 * PERMISSIONS
 ******************************************************************************************************************/

  //override Base Component
  protected reRouteIfNoAccess(route: string, queryParams?: any): void {
    this.dialogRef.close();
  }


}
