import { Provider } from '@angular/core';
import { Routes } from '@angular/router';

import { CategoryService } from 'src/app/services/category.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { AdminAuthGuardService } from 'src/app/services/admin-auth-guard.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { OrderService } from 'src/app/services/order.service';

/*---components---*/
import { AppComponent } from 'src/app/app.component';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { HomeComponent } from 'src/app/home/home.component';
import { ProductsComponent } from 'src/app/shopping/products/products.component';
import { ShoppingCartComponent } from 'src/app/shopping/shopping-cart/shopping-cart.component';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';

import { LoginComponent } from 'src/app/login/login.component';
import { CheckOutComponent } from 'src/app/shopping/check-out/check-out.component';
import { MyOrdersComponent } from 'src/app/shopping/my-orders/my-orders.component';
import { NotAdminComponent } from 'src/app/not-admin/not-admin.component';

import { AdminProductsComponent } from 'src/app/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from 'src/app/admin/admin-orders/admin-orders.component';
import { ProductFormComponent } from 'src/app/admin/product-form/product-form.component';
import { AdminManageProductsComponent } from 'src/app/admin/admin-manage-products/admin-manage-products.component';
import { ProductFilterComponent } from 'src/app/shopping/products/product-filter/product-filter.component';
import { ProductCardComponent } from 'src/app/shopping/products/product-card/product-card.component';
import { QuantityCardComponent } from 'src/app/shopping/quantity-card/quantity-card.component'

/*---components---*/
export const components : any[] = [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    NotFoundComponent,

    LoginComponent,
    CheckOutComponent,
    MyOrdersComponent,
    NotAdminComponent,

    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
    AdminManageProductsComponent,
    ProductFilterComponent,
    ProductCardComponent,
    QuantityCardComponent
];

/*---services---*/
export const services : Provider [] = [
  UserService,
  AuthService,
  AuthGuardService, 
  AdminAuthGuardService, 
  CategoryService,
  ProductService,
  ShoppingCartService,
  OrderService
];

/*---routes---*/
export const routes: Routes = [
  { path: '', component: HomeComponent   },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent , canActivate : [AuthGuardService]},
  { path: 'shopping-cart', component: ShoppingCartComponent , canActivate : [AuthGuardService] },
  { path: 'check-out/:id', component: CheckOutComponent , canActivate : [AuthGuardService]},
  { path: 'my-orders', component: MyOrdersComponent , canActivate : [AuthGuardService]},
  { path: 'admin/products/new', component: ProductFormComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
  { path: 'admin/products/:id', component: ProductFormComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
  { path: 'admin/products', component: AdminProductsComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
  { path: 'admin/manage-products', component: AdminManageProductsComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
  { path: 'admin/orders', component: AdminOrdersComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
  { path: 'not-admin', component: NotAdminComponent , canActivate : [AuthGuardService]},
  { path: '**', component: NotFoundComponent  },
];
