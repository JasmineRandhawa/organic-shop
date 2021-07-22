import { ShoppingCart } from 'src/app/models/shopping-cart';
import { getCartIdFromLocalStorage, isEmpty } from 'src/app/utility/helper';
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

  ngOnInit() {

    /*---Navigating user to return url if user is logged in---*/
    this.authService.user$
                    .subscribe((user:firebase.User |null | undefined)=>
                    {
                      this.cartItemsCount = 0;
                      if(user && user.uid)
                      {
                        this.userService.save(user);
                        this.userId = user.uid;
                        console.log(this.userId);
                        this.navigateToReturnURL();

                        this.getCartInfo();
                      }
                    });
  }

  /*---Inject services to get shopping-cart data for logegd in suer if any---*/
  constructor(private userService : UserService , private authService : AuthService,
              private router : Router, private cartService : ShoppingCartService) {
            
  }

  private getCartInfo()
  {
    this.cartSubscription  =  this.cartService
                        .getAll()
                        .subscribe((carts: ShoppingCart[]) => {

                        carts.map(async (cart: any) => {
                          if (cart) {
                            let cartUId = this.getCartId(cart);
                            if(cart.uId == cartUId)
                              this.populateCartItemCount(cart);
                          }
                        });
                      });
  }
  
  /*---Match the cart user against the logged in user 
       and extract that cartId and save in local storage---*/
  private getCartId(cart : ShoppingCart)
  {
    let cartUId = getCartIdFromLocalStorage();
    if (isEmpty(cartUId)) {
      if (this.userId == cart.user.uId) {
        cartUId =  cart.uId;
        localStorage.setItem('cartUId', cartUId);
      }
    }
    return cartUId;
  }

  /*---Populate cart Items count for dispaly on navbar---*/
  private populateCartItemCount(cart : any)
  {
    if (!isEmpty(cart.uId)) {
      let shoppingCart = new ShoppingCart(cart.items, cart.uId, 
                                          cart.user, cart.dateCreated);  
      console.log(shoppingCart);   
      this.cartItemsCount = shoppingCart.totalItemsCount;
    }
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
  }

}
