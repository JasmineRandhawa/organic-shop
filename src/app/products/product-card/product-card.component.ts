import { Product } from 'src/app/models/product';
import { ShoppingCartItem } from './../../models/shopping-cart-item';
import { ShoppingCartService } from './../../services/shopping-cart.service';

import { isEmpty } from 'src/app/utility/helper';

import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
/*---Product card component for rendering single product---*/
export class ProductCardComponent implements OnDestroy{

  /*---class property declarations---*/
  @Input('product') product: Product | undefined;
  cartSubscription:Subscription | undefined;
  cartItem:ShoppingCartItem | undefined;
  
  /*---Inject shopping cart service---*/
  constructor(private cartService:ShoppingCartService) { 
   
  }

  /*----get shopping cart items based on cart's uniquer Id and product's unique Id----*/ 
  get shoppingCartItem()
  {
    let cartUId = localStorage.getItem('cartUId');
    if(!isEmpty(cartUId) && this.product?.uId && !isEmpty(this.product.uId))
    {
      this.cartSubscription = this.cartService.getCartItem(cartUId || "",this.product.uId || "")
                                              .subscribe((cartSnapShot : any)=>
                                                { 
                                                  let cartJSON = cartSnapShot.payload.toJSON();
                                                  if(cartJSON)
                                                  this.cartItem = ({ product:this.product,
                                                            quantity:cartJSON['quantity']
                                                          } as ShoppingCartItem ) ;
                                                  else
                                                    this.cartItem = undefined ;
                                                });
    }
    return this.cartItem;  
  }

  
  /*---Add product to shopping cart---*/
  addToCart(product:Product|null|undefined)
  {
    if(product)
     this.cartService.addToCart(product);
  }

  removeFromCart(product:Product|null|undefined)
  {
    //if(product)
     //this.cartService.removeFromCart(product);
  }

  /*----unsubscribe from cart service on component destruction----*/ 
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
  
}
