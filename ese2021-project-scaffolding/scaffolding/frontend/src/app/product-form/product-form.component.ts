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
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup | undefined;

  productId: number | undefined;

  product: Product | undefined;

  isSubmitted: boolean;

  isCreate: boolean;

  isUpdate: boolean;


  constructor(public httpClient: HttpClient, private fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.isSubmitted= false;
    this.isCreate = false;
    this.isUpdate = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['create'] == 'true') {
        this.isCreate = params['create'];
      } else if (params['update'] == 'true') {
        this.isUpdate = params['update']
        this.productId = params['productId'];
      }
      console.log(this.productId);
    });
    if (this.isCreate) {
      this.initializeFormCreate();
    } else if (this.isUpdate) {
      this.initializeFormCreate();
      //currently not set because no backend yet

      if (this.productId != null) {
        this.httpClient.get(environment.endpointURL + "product/byId", {
          params: {
            productId: this.productId
          }
        }).subscribe((res: any) => {
          console.log(res);
          this.product = new Product(res.productId, res.shopId, res.title, res.description, res.image, res.price, res.category, res.sold);
          console.log(this.product);
          this.initializeFormUpdate();
        }, (error: any) => {
          console.log(error);
        });
      }
    }
  }


  initializeFormCreate(): void {
    this.productForm = this.fb.group({
      productTitle: new FormControl('', Validators.required),
      productImage : new FormControl(''),
      productDescription : new FormControl(''),
      productCategory : new FormControl('', Validators.required),
      productPrice : new FormControl('', Validators.required)
    }, {
      validator: (form: FormGroup) => {return this.checkProduct(form);}
    });
  }

  //does not work currently
  initializeFormUpdate(): void {
    this.productForm = this.fb.group({
      "productTitle": new FormControl(this.product?.title, Validators.required),
      "productImage": new FormControl(this.product?.image),
      "productDescription": new FormControl(this.product?.description),
      "productCategory": new FormControl(this.product?.category, Validators.required),
      "productPrice": new FormControl(this.product?.price, Validators.required)
    }, {
      validator: (form: FormGroup) => {
        return this.checkProduct(form);
      }
    });
  }

  onSubmit(formDirective: FormGroupDirective): void{
    console.log(this.productForm)
    this.isSubmitted = true;
    if(this.productForm?.valid){
      if(this.isCreate){
        this.sendCreateForm();
      }
      else if (this.isUpdate) {
        this.sendUpdateForm();
      }
    }
    this.router.navigate(['/shop']);
  }

  sendCreateForm(): void {
    this.httpClient.post(environment.endpointURL + "product/create", {
      title: this.productForm?.value.productTitle,
      description: this.productForm?.value.productDescription,
      image: this.productForm?.value.productImage,
      category: this.productForm?.value.productCategory,
      price : this.productForm?.value.productPrice
    }, ).subscribe((res: any) => {
        console.log(res);
        this.isSubmitted = false;
      },
      (error: any) =>{
        console.log(error);
        this.isSubmitted = false;
      });
  }

  sendUpdateForm(): void {
    this.httpClient.post(environment.endpointURL + "product/modify", {
      productId: this.product?.productId,
      shopId: this.product?.shopId,
      title: this.productForm?.value.productTitle,
      text: this.productForm?.value.productDescription,
      image: this.productForm?.value.productImage,
      category: this.productForm?.value.productCategory,
      price: this.productForm?.value.productPrice,
      sold: this.productForm?.value.productSold
    }, ).subscribe((res: any) => {
        console.log(res);
        this.isSubmitted = false;
      },
      (error: any) =>{
        console.log(error);
        this.isSubmitted = false;
      });
  }


  checkProduct(form: FormGroup): {[s: string]: boolean}{
    if(form.value.productImage == "" && form.value.productDescription == ""){
      console.log("error");
      return {'missingProductContent': true};
    }
    console.log("correct");
    return null;
  };




}
