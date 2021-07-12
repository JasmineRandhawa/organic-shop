import { CategoryService } from './Services/category.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './Services/auth-guard.service';
import { UserService } from './Services/user.service';
import { AuthService } from './Services/auth.service';
import { AdminAuthGuardService } from './Services/admin-auth-guard.service';
import { environment } from 'src/environments/environment';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { FormsModule } from '@angular/forms';
import { NotAdminComponent } from './not-admin/not-admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    LoginComponent,
    ProductFormComponent,
    NotAdminComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule,
    RouterModule.forRoot(
      [
        { path: '', component: HomeComponent   },
        { path: 'login', component: LoginComponent  },
        { path: 'products', component: ProductsComponent },
        { path: 'shopping-cart', component: ShoppingCartComponent , canActivate : [AuthGuardService] },
        { path: 'check-out', component: CheckOutComponent , canActivate : [AuthGuardService]},
        { path: 'order-success', component: OrderSuccessComponent , canActivate : [AuthGuardService]},
        { path: 'my-orders', component: MyOrdersComponent , canActivate : [AuthGuardService]},
        { path: 'admin/products', component: AdminProductsComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
        { path: 'admin/products/new', component: ProductFormComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
        { path: 'admin/orders', component: AdminOrdersComponent , canActivate : [AuthGuardService,AdminAuthGuardService]},
        { path: 'not-admin', component: NotAdminComponent , canActivate : [AuthGuardService]},
        { path: '**', component: NotFoundComponent  },
      ]
    )
  ],
  providers: [UserService,AuthService,AuthGuardService, AdminAuthGuardService, CategoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
