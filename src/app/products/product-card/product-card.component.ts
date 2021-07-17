import { Product } from 'src/app/models/product';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
/*---Product card component for rendering single product---*/
export class ProductCardComponent{

  /*---class property declarations---*/
  @Input('product') product: Product | undefined;
  
  constructor() { }

}
