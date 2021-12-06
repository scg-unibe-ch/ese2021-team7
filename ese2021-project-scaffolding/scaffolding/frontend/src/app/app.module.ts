import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-list/todo-item/todo-item.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { RegistrationComponent } from './registration/registration.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FeedComponent } from './feed/feed.component';
import { PostComponent } from './feed/post/post.component';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {RouterModule} from "@angular/router";
import {MatMenuModule} from '@angular/material/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderComponent } from './order-list/order/order.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product-list/product/product.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PostFormComponent } from './post-form/post-form.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './ui/confirmation-dialog/confirmation-dialog.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import {MatTableModule} from '@angular/material/table';
import { UserListComponent } from './user-list/user-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryFormComponent } from './category-form/category-form.component';
import { BaseFormComponent } from './base-form/base-form.component';


@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    LoginComponent,
    RegistrationComponent,
    FeedComponent,
    PostComponent,
    PageNotFoundComponent,
    UserProfileComponent,
    OrderListComponent,
    OrderComponent,
    ProductListComponent,
    ProductComponent,
    PurchaseComponent,
    PostFormComponent,
    ProductFormComponent,
    ConfirmationDialogComponent,
    AdminDashboardComponent,
    UserListComponent,
    CategoryListComponent,
    CategoryFormComponent,
    BaseFormComponent
  ],
  entryComponents:[
    CategoryFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatGridListModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSidenavModule,
    MatDialogModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot([
      { path: 'feed', component: FeedComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
      { path: 'home', component: FeedComponent},
      { path: 'post-form', component: PostFormComponent},
      { path: '', component: FeedComponent},
      { path: 'product-form', component: ProductFormComponent},
      { path: 'purchase', component: PurchaseComponent},
      { path: 'shop', component: ProductListComponent},
      { path: 'product', component: ProductComponent},
      { path: 'order', component: OrderListComponent},
      { path: 'admin-dashboard', component: AdminDashboardComponent},
      { path: 'user-list', component:UserListComponent},
      { path: 'category-list', component: CategoryListComponent},
      { path: 'category-form', component: CategoryFormComponent}
    ]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
