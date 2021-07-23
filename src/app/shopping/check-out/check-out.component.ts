import { ShoppingCart } from 'src/app/models/shopping-cart';
import { Order } from 'src/app/models/order';

import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { OrderService } from 'src/app/services/order.service';

import { showAlertOnAction, getCurrentDate } from 'src/app/utility/helper';

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  cartSubscription : Subscription | undefined;
  cartIdSubscription : Subscription | undefined;

  /*----Subscribe to query params----*/
  constructor(private route : ActivatedRoute, private cartService: ShoppingCartService , 
              private orderService:OrderService , private router: Router) { 
     //get the cart object from the query param
     this.cartIdSubscription =  this.route
                                    .paramMap
                                    .subscribe((cartParams:any) => {
                                      this.cart.cartUId = cartParams.get('id');

                                      this.subscribeToCart();
                                      
                                    });
  }

  /*----subscribe to cart service to get cart Info----*/
  private subscribeToCart(): void {
    this.cartSubscription = this.cartService
                                .getCart(this.cart.cartUId)
                                .subscribe((cart) => {
                                  if (cart) {
                                    this.cart = new ShoppingCart(cart.items, cart.cartUId,
                                                                 cart.user, cart.dateCreated);    
                                  }
                                });
  }

  onPlaceOrder(formValue:any)
  {
    let shoppingCart = {items:this.cart.itemsMap, cartUId : this.cart.cartUId}
    let orderObj = new Order(shoppingCart, "", formValue.name, formValue.address,
                             this.cart.user,getCurrentDate());
    let newOrderUId = this.orderService.save(orderObj);
    showAlertOnAction("Order", newOrderUId,"place",this.router,'/my-orders');
  }

  /*----unsubscribe from cart service on component destruction----*/
  ngOnDestroy(): void {
    this.cartIdSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
  }
}
