import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { isEmpty, showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
/*---Component to Display all shopping cart items---*/
export class ShoppingCartComponent implements OnInit,OnDestroy {

  /*---class feilds declarations---*/
  cartItems: ShoppingCartItem[] | undefined;
  cartSubscription: Subscription | undefined;
  cartItemsCount: number = 0;
  totalPrice:number = 0;

  /*---Get all items in the shopping cart and computer total price and items count ---*/
  ngOnInit(): void {
    let cartUId = localStorage.getItem('cartUId') || "";
    if (!isEmpty(cartUId))
      this.cartSubscription = this.cartService.getCart(cartUId)
                                              .subscribe((cartSnapshot: any) => {

                                                this.cartItems = [];
                                                this.totalPrice = 0;
                                                this.cartItemsCount = 0;

                                                if (cartSnapshot.key) {
                                                  let itemsArray = cartSnapshot.payload
                                                                                .toJSON()['items'] as ShoppingCartItem[];
                                                  for (let item in itemsArray) {
                                                    let cartItem = itemsArray[item] as ShoppingCartItem;

                                                    //computer items count
                                                    this.cartItemsCount += cartItem.quantity;
                                                    
                                                    //computer total price 
                                                    if( cartItem.product.price)
                                                      this.totalPrice += cartItem.quantity * cartItem.product.price;
                                                    
                                                    //populate cart items list
                                                    this.cartItems?.push({ product: cartItem.product,
                                                                           quantity: cartItem.quantity });
                                                  }
                                                }
                                              });
  }

  /*---Inject shopping cart service---*/
  constructor(private cartService: ShoppingCartService, private router: Router) {
  }

  /*---Increment product quantity in shopping cart---*/
  addUpdateCart(cartItem: ShoppingCartItem | null | undefined) {
    if (cartItem && cartItem.product && cartItem.quantity) {
      cartItem.quantity = cartItem.quantity + 1;
      this.cartItemsCount = this.cartItemsCount + 1;
      this.cartService.updateCart(cartItem);
    }
  }

  /*---Decrement product quantity in shopping cart---*/
  reduceUpdateCart(cartItem: ShoppingCartItem | null | undefined) {
    if (cartItem) {
      if (cartItem.quantity)
      {
        cartItem.quantity = cartItem.quantity - 1;
        this.cartItemsCount = this.cartItemsCount - 1;
      }

      //if updated quantity is greater than 0 , update quantity of product in cart   
      if (cartItem.product && cartItem.quantity > 0)
        this.cartService.updateCart(cartItem);

      //if updated quantity is less than 0 ,remove item from cart  
      else
        this.cartService.removeFromCart(cartItem.product?.uId || "")

      if(this.cartItemsCount<0) this.cartItemsCount = 0;
    }
  }

  /*---remove all Items from the shopping cart---*/
  async clearCart()
  {
    let cartUId = localStorage.getItem('cartUId') || "";
    let isDeleted = await this.cartService.delete(cartUId);
    showAlertOnAction("Cart Items" , isDeleted , "cleare", this.router,"/products")
    if(isDeleted) localStorage.removeItem('cartUId');
  }
  
  /*--Unsunscribe from the cart service on component destruction--*/
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}
