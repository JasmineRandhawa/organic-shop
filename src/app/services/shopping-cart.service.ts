import { Product } from '../models/product';
import { AppUser } from '../models/app-user';
import { LoggedInUser } from './../models/logged-in-user';
import { ShoppingCartItem } from './../models/shopping-cart-item';
import { ShoppingCart } from '../models/shopping-cart';

import { AuthService } from './auth.service';
import { isEmpty,getCurrentDate } from 'src/app/utility/helper';

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { ɵInternalFormsSharedModule } from '@angular/forms';

@Injectable()

/*--Shopping Cart Service to get/save/update/delete shopping-cart data from firebase database--*/
export class ShoppingCartService {

  user: LoggedInUser | undefined;

  /*---Inject angular fire database--*/
  constructor(private db: AngularFireDatabase, private authService:AuthService) {
   this.authService.appUser$.pipe(take(1)).subscribe((user:AppUser | null)=>
                      {
                        if(user)
                          this.user = {uId : user.uId , name:user.name}
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
  getCartItem(cartUId :string, itemUId:string) 
  {
    return this.getItem(cartUId,itemUId).snapshotChanges();
  }

 /*---add product shopping cart to firebase database--*/
  async addToCart(product:Product) {
    let cartUId = await this.getCartId() + "";

    //get item from shopping cart table items 
    let item$ = this.getItem(cartUId, product.uId || "");
    item$.snapshotChanges()
         .pipe(take(1))
         .subscribe((itemSnapShot:any)=>
            {
              //if item exists , add the item
              if(itemSnapShot.payload.toJSON())
              {
                let itemJSON = itemSnapShot.payload.toJSON();
                let item = { product : itemJSON['product'],
                              quantity: Number(itemJSON['quantity'])+1
                            } as ShoppingCartItem;
                item$.update(item);
              }
              //if item does not exists, update the item
              else
              {
                  let item = {product : product, quantity:1} as ShoppingCartItem;
                  item$.set(item );
              }
         });
  }

  /*---delete existing shopping cart from firebase database based on shopping-cart's unique Id--*/
  delete(cartUId: string) : Promise<boolean>  {
    return this.db.list('/shopping-carts/'+cartUId)
                  .remove()
                  .then(()=>true)
                  .catch(()=>false);
  }
}
