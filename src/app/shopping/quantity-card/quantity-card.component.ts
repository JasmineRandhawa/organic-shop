import { LoggedInUser } from 'src/app/models/logged-in-user';
import { AppUser } from 'src/app/models/app-user';

import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { AuthService } from 'src/app/services/auth.service';

import { getCartIdFromLocalStorage, getCurrentDate, isEmpty } from 'src/app/utility/helper';

import { Component, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
  selector: 'quantity-card',
  templateUrl: './quantity-card.component.html',
  styleUrls: ['./quantity-card.component.css']
})
export class QuantityCardComponent implements OnDestroy {

   /*---class property declarations---*/
  @Input('cart-item') cartItem: ShoppingCartItem | undefined;
  loggedInUser : LoggedInUser = new LoggedInUser();
  userSubscription: Subscription;

  /*---Inject shopping cart service---*/
  constructor(private authService:AuthService,private cartService:ShoppingCartService) { 
    //get loggedinUser
    this.userSubscription = this.authService
                                .appUser$
                                .pipe(take(1))
                                .subscribe((appUser :AppUser | null) => {
                                  if(appUser) this.loggedInUser = new LoggedInUser(appUser.uId, appUser.name);
                                });
                          }

  /*---add product to Cart---*/
  addToCart()
  {
    let cartUId = getCartIdFromLocalStorage();
    if(!isEmpty(cartUId))
    {
      this.updateCart();
      return;
    }
    this.createAndAddToCart();
  }

  /*--First time add a cart entry--*/
  createAndAddToCart()
  {
    if(this.cartItem)
    {
      this.cartItem.quantity = 1;
      let itemsMap : { [productId : string] : ShoppingCartItem } = {} ;
      itemsMap[this.cartItem.product.productUId] = this.cartItem;

      let cart = { cartUId : "", dateCreated : getCurrentDate(),
                  user: this.loggedInUser, items: itemsMap};
      this.cartService.addToCart(cart);
    }
  }

  /*---Increment product quantity in shopping cart---*/
  updateCart()
  {
    if(this.cartItem)
    {
      this.cartItem.quantity = 1;
      this.cartService.updateCart(this.cartItem);
    }
  }

  /*---Increment product quantity in shopping cart---*/
  incrementCart()
  {
    if(this.cartItem)
    {
      this.cartItem.quantity =  this.cartItem.quantity + 1;
      this.cartService.updateCart(this.cartItem);
    }
  }

  /*---Decrement product quantity in shopping cart---*/
  decrementCart()
  {
    if(this.cartItem)
    {
    this.cartItem.quantity =  this.cartItem.quantity - 1;
    
    //if updated quantity is greater than 0 , update quantity of product in cart   
    if(this.cartItem.quantity > 0 )
        this.cartService.updateCart(this.cartItem);
    //if updated quantity is less than 0 ,remove item from cart  
    else
        this.cartService.removeFromCart(this.cartItem.product.productUId || "")
    }
  } 

  /*---unsubscribe from user service once component is destroyed---*/
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

}
