import { ShoppingCart } from 'src/app/models/shopping-cart';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/*---Main Parent component of application---*/
export class AppComponent implements OnInit, OnDestroy {

  /*---class property declarations---*/
  title = 'organic-shop';
  userId : string = "";
  cartItemsCount : number  = 0;
  cartSubscription : Subscription | undefined;
  subscription : Subscription | undefined;

  ngOnInit() {
     /*---Navigating user to return url if user is logged in---*/
     this.subscription =  this.authService.user$
                              .subscribe((user:firebase.User |null | undefined)=>
                              {
                                this.cartItemsCount = 0;
                                if(user && user.uid)
                                {
                                  this.userService.save(user);
                                  this.userId = user.uid;
                                  this.navigateToReturnURL();

                                  this.subscibeToCartInfo();
                                }
                              });
}

  /*---Inject services to get user and cart data---*/
  constructor(private userService : UserService , private authService : AuthService,
              private router : Router, private cartService : ShoppingCartService) {

  }

  /*---subscrivbe to cart service to get shopping-cart data for logged in user if any---*/
  private subscibeToCartInfo()
  {
    this.cartSubscription  =  this.cartService
                                  .getAll()
                                  .subscribe((carts: ShoppingCart[]) => {
                                    this.cartItemsCount = 0;
                                    localStorage.removeItem('cartUId');
                                    carts.map(async (cart: any) => {
                                    if (cart && cart.user && this.userId == cart.user.uId) {
                                        this.populateCartItemCount(cart);
                                        localStorage.setItem('cartUId', cart.cartUId);
                                    }
                                  });
                                });
  }
  
  /*---Populate cart Items count for dispaly on navbar---*/
  private populateCartItemCount(cart : any)
  {
      let shoppingCart = new ShoppingCart(cart.items, cart.cartUId, 
                                          cart.user, cart.dateCreated);  
      this.cartItemsCount = shoppingCart.totalItemsCount;
  }

  /*---Navigate to return URl if any---*/
  private navigateToReturnURL()
  {
    /* extract return url from local storage*/
    let returnURL = localStorage.getItem('returnURL');

    //clear the return url after extration
    localStorage.removeItem('returnURL');
    //navigate user to return url
    if (returnURL && returnURL !== '/' && returnURL !== '/login')
      this.router.navigateByUrl(returnURL);
  }

  /*--Unsunscribe from the cart service on component destruction--*/
  ngOnDestroy() : void {
    this.cartSubscription?.unsubscribe();
    this.subscription?.unsubscribe();
  }

}
