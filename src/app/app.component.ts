import { ShoppingCart } from './models/shopping-cart';
import { getCartIdFromLocalStorage, isEmpty } from 'src/app/utility/helper';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ShoppingCartService } from './services/shopping-cart.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/* Main Parent component of application */
export class AppComponent implements OnInit,OnDestroy {
  title = 'organic-shop';

  userId:string = "";
  cartItemsCount: number  = 0;
  cartSubscription: Subscription|undefined;

  /*---Get shopping cart count for nav bar display---*/
  ngOnInit() {

    this.cartSubscription  = this.cartService
                                 .getAll()
                                 .subscribe((carts: ShoppingCart[]) => {
                                  this.cartItemsCount = 0;
                                  carts.map(async (cart: ShoppingCart) => {
                                    if (cart) {
                                    
                                      //match the user against the logged in user and extract that cartId and save in local storage
                                      let cartUId = getCartIdFromLocalStorage();
                                      if (isEmpty(cartUId)) {
                                        console.log(this.userId);
                                        console.log(cart.user.uId);
                                        if (this.userId == cart.user.uId) {
                                          cartUId =  cart.uId;
                                          localStorage.setItem('cartUId', cart.uId);
                                        }
                                      }
                                      if (!isEmpty(cartUId)) {
                                        let shoppingCart = new ShoppingCart([], cartUId,
                                                                            cart.user, cart.dateCreated);
                                        for(let item in cart.items)
                                            shoppingCart.items.push(cart.items[item]);                
                                        this.cartItemsCount = shoppingCart.totalItemsCount;
                                      }
                                    }
                                    
                                  });
                                });
  }

  /* Contructor invoked on loading all appliaction components */
  constructor(private userService: UserService, private authService: AuthService,
              private router: Router, private cartService: ShoppingCartService) {

    /* navigating user to return url if user is logged in*/
    this.authService.user$
                    ?.subscribe((user:firebase.User |null | undefined)=>
                    {
                      if(user && user.uid)
                      {
                        this.userService.save(user);
                        this.userId = user.uid;
                        /* extract return url from local storage*/
                        let returnURL = localStorage.getItem('returnURL');

                        //clear the return url after extration
                        localStorage.removeItem('returnURL');
                        //navigate user to return url
                        if (returnURL && returnURL !== '/' && returnURL !== '/login')
                          this.router.navigateByUrl(returnURL);
                      }
                    });
  }

  /*--Unsunscribe from the cart service on component destruction--*/
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

}
