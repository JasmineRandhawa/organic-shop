import { ShoppingCartItem } from './../models/shopping-cart-item';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { isEmpty } from '../utility/helper';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit,OnDestroy {

  cartItems: ShoppingCartItem[] | undefined;
  cartSubscription: Subscription | undefined;
  cartItemsCount: number = 0;
  totalPrice:number = 0;

  constructor(private cartService: ShoppingCartService) {
    

  }

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
                                                    this.cartItemsCount += cartItem.quantity;
                                                    if( cartItem.product.price)
                                                    this.totalPrice += cartItem.quantity * cartItem.product.price;
                                                    this.cartItems?.push({ product: cartItem.product,
                                                                           quantity: cartItem.quantity });
                                                  }
                                                }
                                              });
  }

  addUpdateCart(cartItem: ShoppingCartItem | null | undefined) {
    if (cartItem && cartItem.product && cartItem.quantity) {
      cartItem.quantity = cartItem.quantity + 1;
      this.cartItemsCount = this.cartItemsCount + 1;
      this.cartService.updateCart(cartItem);
    }
  }

  reduceUpdateCart(cartItem: ShoppingCartItem | null | undefined) {
    if (cartItem) {
      if (cartItem.quantity)
      {
        cartItem.quantity = cartItem.quantity - 1;
        this.cartItemsCount = this.cartItemsCount - 1;
      }
      if (cartItem.product && cartItem.quantity > 0)
        this.cartService.updateCart(cartItem);
      else
        this.cartService.removeFromCart(cartItem.product?.uId || "")

      if(this.cartItemsCount<0) this.cartItemsCount = 0;
    }
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

}
