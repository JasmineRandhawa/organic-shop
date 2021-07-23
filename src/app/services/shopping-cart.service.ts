import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { ShoppingCart } from 'src/app/models/shopping-cart';

import { isEmpty, getCartIdFromLocalStorage } from 'src/app/utility/helper';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

import { Observable } from 'rxjs';

@Injectable()

/*---Shopping Cart Service to get/save/update/delete 
     shopping-cart data from firebase database---*/
export class ShoppingCartService {

  /*---class property declarations---*/


  /*---Inject angular fire database---*/
  constructor(private db: AngularFireDatabase) {

  }

  /*---get all carts in the shopping-carts table---*/
  getAll(): Observable<ShoppingCart[]>
  {
    return this.db.list<ShoppingCart>('shopping-carts').valueChanges();
  }

  /*---Get Shopping cart Item based on cartUId---*/
  getCart(cartUId :string) : Observable<any|null>
  {
    return this.getCartRef(cartUId).valueChanges();
  }

  getItem(cartUId :string , itemUId:string) 
  {
    return this.db.object('/shopping-carts/'+ cartUId + '/items/' + itemUId).valueChanges();
  }

 /*---add product shopping cart to firebase database--*/
  async addToCart(cart:any) {
    let cartUId = this.db.list('/shopping-carts/').push(cart).key || "";
    if(!isEmpty(cartUId))
    {
      this.getCartRef(cartUId).update( { cartUId: cartUId });
    }
  }

  async updateCart(item : ShoppingCartItem)
  {
    let cartUId = getCartIdFromLocalStorage();

    let item$ = this.getCartItem(cartUId , item.product.productUId);
    item$.update(item);
  }

  async removeFromCart(itemUId : string)
  {
    let cartUId = getCartIdFromLocalStorage();
    this.getCartItem(cartUId, itemUId).remove();
  }

  /*---delete existing shopping cart from firebase database based on shopping-cart's unique Id--*/
  async deleteCart() : Promise<boolean>  {
    let cartUId = getCartIdFromLocalStorage();
   
    return this.getCartRef(cartUId)
               .remove()
               .then(()=>
                { 
                  localStorage.removeItem('cartUId'); 
                  return true;
                })
               .catch(()=>false);
  }

  /*---------------------------Private Methods-------------------------*/

  /*---Get Shopping cart Item based on cartUId and product's unique Id---*/
  private getCartItem(cartUId :string , itemUId:string) 
  {
    return this.db.object('/shopping-carts/'+ cartUId + '/items/' + itemUId);
  }

  /*---Get Shopping cart Item based on cartUId---*/
  private getCartRef(cartUId :string) : AngularFireObject<unknown>
  {
    return this.db.object('/shopping-carts/' + cartUId);
  }

  /*-------------------------------------------------------------------*/
}
