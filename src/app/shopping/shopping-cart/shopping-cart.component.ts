import { ShoppingCart } from '../../models/shopping-cart';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { getCartIdFromLocalStorage, isEmpty, showAlertOnAction } from 'src/app/utility/helper';

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
  cartSubscription: Subscription | undefined;
  cart:ShoppingCart = new ShoppingCart({});
  cartIdFormLocalStorage:string = getCartIdFromLocalStorage();

  /*---Get all items in the shopping cart and computer total price and items count ---*/
  ngOnInit(): void {
    if (!isEmpty(this.cartIdFormLocalStorage))
      this.cartSubscription = this.cartService.getCart(this.cartIdFormLocalStorage)
                                              .subscribe((cart) => {
                                                if (cart) {
                                                  this.cart = new ShoppingCart(cart.items, cart.uId,
                                                                              cart.user, cart.dateCreated);    
                                                }
                                              });
  }

  /*---Inject shopping cart service---*/
  constructor(private cartService: ShoppingCartService, private router: Router) {
  }

  get isAnyItems()
  {
    return this.cart.items.length > 0
  }

  /*---remove all Items from the shopping cart---*/
  async clearCart()
  {
    let isDeleted = await this.cartService.deleteCart();
    showAlertOnAction("Cart Items" , isDeleted , "cleare", this.router,"/products")
    if(isDeleted) localStorage.removeItem('cartUId');
  }

  checkOut()
  {
    this.router.navigate(['/check-out'],{queryParams:{ ...this.cart },skipLocationChange: true});
  }
  
  /*--Unsunscribe from the cart service on component destruction--*/
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}
