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

  product: Product | undefined;

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
        // temporary until backend in place
        this.product = new Product(this.productId, 1, "testprodukt", "hier kommt die produktbeschreibung", "link zum bild", 205, "Category", false);
        this.initializePurchaseForm();
        /*
          this.httpClient.get(environment.endpointURL + "product/byId", {
            params: {
              productId: this.productId
            }
          }).subscribe((res: any) => {
            console.log(res);
            this.product = new Product(res.postId, 0, res.title, res.text, res.image, res.upvote, res.downvote, 0, res.category, res.createdAt, res.UserUserId,'');
            console.log(this.product);
            this.initializeForm();
          }, (error: any) => {
            console.log(error);
          });

         */
      }
    }
  }

  initializePurchaseForm(): void {
    this.purchaseForm = this.fb.group({
      paymentMethod: new FormControl('Invoice', Validators.required),
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
    console.log(this.purchaseForm);
    /*
    this.httpClient.post(environment.endpointURL + "order/create", {
      title: this.postForm.value.postTitle,
      text: this.postForm.value.postText,
      image: this.postForm.value.postImage,
      category: this.postForm.value.postCategory
    }, ).subscribe((res: any) => {
        console.log(res);
        this.isSubmitted = false;
        this.router.navigate(['/feed'], {queryParams : {loggedIn : 'true'}});
      },
      (error: any) =>{
        console.log(error);
        this.isSubmitted = false;
      });
      */

  }





}
