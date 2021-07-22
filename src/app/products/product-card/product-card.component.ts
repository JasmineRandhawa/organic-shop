import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { Component, Input} from '@angular/core';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
/*---Product card component for rendering single product---*/
export class ProductCardComponent{

  /*---class property declarations---*/
  @Input('cart-item') cartItem: ShoppingCartItem  = new ShoppingCartItem();
}
