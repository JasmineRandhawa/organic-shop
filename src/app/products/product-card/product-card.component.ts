import { Product } from 'src/app/models/product';
import { ShoppingCartItem } from './../../models/shopping-cart-item';
import { ShoppingCartService } from './../../services/shopping-cart.service';

import { isEmpty } from 'src/app/utility/helper';

import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
/*---Product card component for rendering single product---*/
export class ProductCardComponent{

  /*---class property declarations---*/
  @Input('product') product: Product | undefined;
  
  /*---Inject shopping cart service---*/
  constructor(private cartService:ShoppingCartService) { }

  /*---Add product to shopping cart---*/
  addToCart(product:Product|null|undefined)
  {
    if(product)
     this.cartService.addToCart(product);
  }


  
}
