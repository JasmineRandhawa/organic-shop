import { AppUser } from '../models/app-user';
import { LoggedInUser } from './../models/logged-in-user';
import { ShoppingCartItem } from './../models/shopping-cart-item';
import { ShoppingCart } from '../models/shopping-cart';

import { AuthService } from './auth.service';
import { isEmpty,getCurrentDate } from 'src/app/utility/helper';

import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable()

/*--Shopping Cart Service to get/save/update/delete shopping-cart data from firebase database--*/
export class ShoppingCartService  implements OnDestroy{

  user: LoggedInUser | undefined;
  cartSubscription:Subscription|undefined;
  cartUId:string|undefined;

  /*---Inject angular fire database--*/
  constructor(private db: AngularFireDatabase, private authService:AuthService) {
    this.authService.appUser$.pipe(take(1)).subscribe((user:AppUser | null)=>
                      {
                        if(user)
                          this.user = {uId : user.uId , name:user.name}
                      });
    this.cartSubscription = this.db.list('shopping-carts').snapshotChanges()
                                    .subscribe((cartsSnapshot: any) => {
                                      cartsSnapshot.map((cartSnapshot:any)=>
                                      {
                                        if(cartSnapshot.key && this.user?.uId)
                                        {
                                          let user = cartSnapshot.payload.toJSON()['user'];
                                          if(this.user == user['uId'])
                                              this.cartUId= cartSnapshot.key;
                                          let cartUId = localStorage.getItem('cartUId');
                                          if(!cartUId)
                                            localStorage.setItem('cartUId',cartSnapshot.key);
                                          }
                                      });
                                    });
  }

  /*---create new cart in firebase database--*/
  private createNewCart() :string | null
  {
    let items:ShoppingCartItem[] = [];
    let shoppingCart = { user: this.user , items:items , dateCreated : getCurrentDate()} as ShoppingCart;
    return this.db.list('/shopping-carts/').push(shoppingCart).key;
  }

  /*---create or get cartUId from firebase database--*/
  private async getCartId() : Promise<string | null> {

    //get shoppign cart if from local storage is any
    let cartUId = localStorage.getItem('cartUId');
    if(!isEmpty(cartUId)) 
    {
      return cartUId;
    }
    
    // create a cart entry and save the new cart's unique Id in local storage
    cartUId = await this.createNewCart();
    if(cartUId)
      localStorage.setItem('cartUId', cartUId);
    return cartUId;
  }

  /*---Get Shopping cart Item based on cartUId and product's unique Id---*/
  private getItem(cartUId :string, itemUId:string) 
  {
    return this.db.object('/shopping-carts/'+cartUId + '/items/' + itemUId);
  }

  /*---Get Shopping cart Item based on cartUId and product's unique Id---*/
  getCartItem(cartUId :string,productUId :string) 
  {
    return this.db.object('/shopping-carts/'+cartUId + "/items/"+ productUId).snapshotChanges();
  }

 /*---add product shopping cart to firebase database--*/
  async addToCart(item:ShoppingCartItem) {
    let cartUId = await this.getCartId() + "";

    //get item from shopping cart table items 
    let item$ = this.getItem(cartUId, item.product.uId || "");
    item$.set(item );
  }

  updateCart(item:ShoppingCartItem)
  {
    let cartUId = localStorage.getItem('cartUId');
    let item$ = this.getItem(cartUId||"", item.product.uId || "");
    item$.update(item);
  }

  removeFromCart(itemUId:string)
  {
    let cartUId = localStorage.getItem('cartUId');
    let item$ = this.getItem(cartUId||"", itemUId || "");
    item$.remove();
  }

  /*---delete existing shopping cart from firebase database based on shopping-cart's unique Id--*/
  delete(cartUId: string) : Promise<boolean>  {
    return this.db.list('/shopping-carts/'+cartUId)
                  .remove()
                  .then(()=>true)
                  .catch(()=>false);
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}
