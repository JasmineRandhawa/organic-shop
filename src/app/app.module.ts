import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';
import { DataTableModule } from 'angular5-data-table';

import { environment } from 'src/environments/environment';

import { CategoryService } from 'src/app/services/category.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { AdminAuthGuardService } from 'src/app/services/admin-auth-guard.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { LoginComponent } from './login/login.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { NotAdminComponent } from './not-admin/not-admin.component';

import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { AdminManageProductsComponent } from './admin/admin-manage-products/admin-manage-products.component';
import { ProductFilterComponent } from './products/product-filter/product-filter.component';
import { ProductCardComponent } from './products/product-card/product-card.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    NotFoundComponent,

    LoginComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    NotAdminComponent,

    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
    AdminManageProductsComponent,
    ProductFilterComponent,
    ProductCardComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,

    FormsModule,
    CustomFormsModule,
    ReactiveFormsModule ,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    DataTableModule,

    RouterModule.forRoot(
      [
        { path: '', component: HomeComponent   },
        { path: 'login', component: LoginComponent },
        { path: 'products', component: ProductsComponent , canActivate : [AuthGuardService]},
        { path: 'shopping-cart', component: ShoppingCartComponent , canActivate : [AuthGuardService] },
        { path: 'check-out', component: CheckOutComponent , canActivate : [AuthGuardService]},
        { path: 'order-success', component: OrderSuccessComponent , canActivate : [AuthGuardService]},
        { path: 'my-orders', component: MyOrdersComponent , canActivate : [AuthGuardService]},
        { path: 'admin/products/new', component: ProductFormComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
        { path: 'admin/products/:id', component: ProductFormComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
        { path: 'admin/products', component: AdminProductsComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
        { path: 'admin/manage-products', component: AdminManageProductsComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
        { path: 'admin/orders', component: AdminOrdersComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
        { path: 'not-admin', component: NotAdminComponent , canActivate : [AuthGuardService]},
        { path: '**', component: NotFoundComponent  },
      ]
    )
  ],

  providers: [
    UserService,
    AuthService,
    AuthGuardService, 
    AdminAuthGuardService, 
    CategoryService,
    ProductService,
    ShoppingCartService
  ],

  bootstrap: [AppComponent]

})

export class AppModule { }
