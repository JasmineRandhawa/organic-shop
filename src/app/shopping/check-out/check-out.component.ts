import { ShoppingCart } from 'src/app/models/shopping-cart';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
/* Check-out Component */
export class CheckOutComponent{

  /*----property declarations----*/
  cart : ShoppingCart = new ShoppingCart({});
  cartSubscription: Subscription | undefined;

  /*----Subscribe to query params----*/
  constructor(private route:ActivatedRoute) { 
     //get the cart object from the query param
     this.cartSubscription =  this.route
                                  .queryParamMap
                                  .subscribe((cartParams:any) => {
                                    this.cart = new ShoppingCart(cartParams['items'],
                                                cartParams['uId'], 
                                                cartParams.user,cartParams.dateCreated);
                                    console.log(this.cart,cartParams);

                                  });
  }

  /*----unsubscribe from cart service on component destruction----*/
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}
