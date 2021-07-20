import { Product } from 'src/app/models/product';
import { ShoppingCartItem } from './../../models/shopping-cart-item';
import { ShoppingCartService } from './../../services/shopping-cart.service';

import { Component, Input} from '@angular/core';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
/*---Product card component for rendering single product---*/
export class ProductCardComponent{

  /*---class property declarations---*/
  @Input('product') product: Product | undefined;
  @Input('quantity') quantity: number | undefined;
  cartItem:ShoppingCartItem | undefined;
  
  /*---Inject shopping cart service---*/
  constructor(private cartService:ShoppingCartService) { 
  }


  /*---Add product to shopping cart---*/
  addToCart(product:Product|null|undefined)
  {
    if(product)
    {
      this.quantity = 1;
      let item = { product :product,
                  quantity: 1
                } as ShoppingCartItem;
      this.cartItem  = item;
      this.cartService.addToCart(item);
    }   
  }

  addUpdateCart(product:Product|null|undefined)
  {
    if(product && this.quantity)
    {
      this.quantity = this.quantity + 1;
      let item = { product :product, quantity:this.quantity} as ShoppingCartItem;
      this.cartService.updateCart(item);
    }  
  }

  reduceUpdateCart(product:Product|null|undefined)
  {
    if(this.quantity)
        this.quantity = this.quantity - 1;
    if(product && product.uId && this.quantity && this.quantity>0)
    {
        let item = { product :product, quantity:this.quantity} as ShoppingCartItem;
        this.cartService.updateCart(item);
      }
      else{
        this.cartService.removeFromCart(product?.uId || "")
      }
  } 
}
