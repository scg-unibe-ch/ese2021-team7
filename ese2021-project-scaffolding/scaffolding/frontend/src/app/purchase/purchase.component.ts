import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {FormControl, FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl, FormGroupDirective} from '@angular/forms';
import { Product } from '../models/product.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  purchaseForm: FormGroup | undefined;

  productId: number | undefined;

  product = new Product(0, 0, "", "", "", 0, "", false);

  user: User | undefined;

  isSubmitted: boolean;

  isCreate: boolean;

  isUpdate: boolean;

  constructor(public httpClient: HttpClient, private fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.isSubmitted = false;
  }

  ngOnInit(): void {
    if(!this.userService.getLoggedIn()){
      console.log("not logged In");
      this.router.navigate(['/login']);
    }
    else{
      this.user = this.userService.getUser();
      this.route.queryParams.subscribe(params => {
          this.productId = params['productId'];
      });
      if(this.productId != null){
        this.httpClient.get(environment.endpointURL + "product/byId", {
          params: {
            productId: this.productId
          }
        }).subscribe((res: any) => {
          console.log(res);
          this.product = new Product(res.productId, 1, res.title,  res.description, res.image,  res.price, res.productCategory, false);
          console.log(this.product);
          this.initializePurchaseForm();
        }, (error: any) => {
          console.log(error);
        });
      }
    }
  }

  initializePurchaseForm(): void {
    this.purchaseForm = this.fb.group({
      paymentMethod: new FormControl("1",Validators.required),
      firstName: new FormControl(this.user.firstName, Validators.required),
      lastName: new FormControl(this.user.lastName, Validators.required),
      street : new FormControl(this.user.street, Validators.required),
      houseNumber : new FormControl(this.user.houseNumber),
      zipCode : new FormControl(this.user.zipCode),
      city : new FormControl(this.user.city),
    });

  }


  onSubmit(formDirective: FormGroupDirective): void{
    console.log(this.purchaseForm)
    this.isSubmitted = true;
    if(this.purchaseForm.valid){
        this.sendPurchaseForm();
    }
  }

  sendPurchaseForm(): void {
    console.log("purchase");
    console.log(this.purchaseForm);
    this.httpClient.post(environment.endpointURL + "order/create", {
      firstName: this.purchaseForm?.value.firstName,
      lastName: this.purchaseForm?.value.lastName,
      street:this.purchaseForm?.value.street,
      houseNr: this.purchaseForm?.value.houseNumber,
      zip: this.purchaseForm?.value.zipCode,
      city: this.purchaseForm?.value.city,
      //deliveryAdress: this.purchaseForm?.value.firstName + " " + this.purchaseForm?.value.lastName + " " + this.purchaseForm?.value.street + " " + this.purchaseForm?.value.houseNumber + " " +
        //this.purchaseForm?.value.zipCode + " " + this.purchaseForm?.value.city,
      paymentOption: this.purchaseForm?.value.paymentMethod,
      user: this.user.userId,
      productId: this.product.productId
    }, ).subscribe((res: any) => {
        console.log(res);
        this.isSubmitted = false;
        this.router.navigate(['/shop']);
      },
      (error: any) =>{
        console.log(error);
        this.isSubmitted = false;
      });


  }

  //keep not sure if need when getting categories dynamically
  //used to pre select default value in select
  /*
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
*/


}
