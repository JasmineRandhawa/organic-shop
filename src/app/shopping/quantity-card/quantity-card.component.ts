import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { ShoppingCartService } from '../../services/shopping-cart.service';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'quantity-card',
  templateUrl: './quantity-card.component.html',
  styleUrls: ['./quantity-card.component.css']
})
export class QuantityCardComponent {

   /*---class property declarations---*/
  @Input('cart-item') cartItem: ShoppingCartItem  = new ShoppingCartItem();

  /*---Inject shopping cart service---*/
  constructor(private cartService:ShoppingCartService) { 
  }

  /*---Increment product quantity in shopping cart---*/
  addToCart()
  {
      this.cartItem.quantity =  this.cartItem.quantity + 1;
      this.cartService.updateCart(this.cartItem);
  }

  /*---Decrement product quantity in shopping cart---*/
  updateCart()
  {
    this.cartItem.quantity =  this.cartItem.quantity - 1;
    
    //if updated quantity is greater than 0 , update quantity of product in cart   
    if(this.cartItem.quantity > 0 )
        this.cartService.updateCart(this.cartItem);
    //if updated quantity is less than 0 ,remove item from cart  
    else
        this.cartService.removeFromCart(this.cartItem.product.uId || "")
  } 

}
