import { LoggedInUser } from './../models/logged-in-user';
import { ShoppingCartItem } from './../models/shopping-cart-item';
import { ShoppingCart } from '../models/shopping-cart';

import { AuthService } from './auth.service';
import { isEmpty,getCurrentDate, getCartIdFromLocalStorage } from 'src/app/utility/helper';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import { AppUser } from '../models/app-user';
import { take } from 'rxjs/operators';

@Injectable()

/*--Shopping Cart Service to get/save/update/delete shopping-cart data from firebase database--*/
export class ShoppingCartService {

  appUser : AppUser = new AppUser();
  userSubscription: Subscription;

  /*---Inject angular fire database--*/
  constructor(private db: AngularFireDatabase, private authService:AuthService) {
    //get loggedinUser
    this.userSubscription = this.authService.appUser$.pipe(take(1)).subscribe((appUser :AppUser | null) => 
                                 {
                                  if(appUser)
                                    this.appUser =new AppUser(appUser.uId,appUser.name,
                                                              appUser.email,appUser.isAdmin);
                                 });
  }

  getAll(): Observable<ShoppingCart[]>
  {
    return this.db.list<ShoppingCart>('shopping-carts').valueChanges();
  }

  /*---create new cart in firebase database--*/
  private createNewCart() : string
  {
    let loggedInUser = new LoggedInUser(this.appUser.uId,this.appUser.name);
    let shoppingCart = new ShoppingCart([],"",loggedInUser , getCurrentDate());
    let cartUId = this.db.list('/shopping-carts/').push(shoppingCart).key || "";
    if(!isEmpty(cartUId)) 
    {
      localStorage.setItem('cartUId', cartUId);
      console.log(cartUId);
      this.getCartRef(cartUId).update({uId: cartUId });
    }
    return cartUId;
  }

  /*---create or get cartUId from firebase database--*/
  private async getCartId() : Promise<string | null> {

    //get shoppign cart if from local storage is any
    let cartUId = getCartIdFromLocalStorage();
    if(!isEmpty(cartUId)) 
      return cartUId;
    
    // create a cart entry and save the new cart's unique Id in local storage
    cartUId = await this.createNewCart();
    return cartUId;
  }

  /*---Get Shopping cart Item based on cartUId and product's unique Id---*/
  private getCartItem(cartUId :string , itemUId:string) 
  {
    return this.db.object('/shopping-carts/'+ cartUId + '/items/' + itemUId);
  }

   /*---Get Shopping cart Item based on cartUId---*/
  getCart(cartUId :string) : Observable<ShoppingCart|null>
  {
   return this.getCartRef(cartUId).valueChanges();
  }

 /*---Get Shopping cart Item based on cartUId---*/
  getCartRef(cartUId :string) : AngularFireObject<ShoppingCart>
  {
     return this.db.object<ShoppingCart>('/shopping-carts/'+cartUId);
  }
 
 /*---add product shopping cart to firebase database--*/
  async addToCart(item:ShoppingCartItem) {
    let cartUId = await this.getCartId() + "";

    //get item from shopping cart table items 
    this.getCartItem(cartUId, item.product.uId || "").set(item );
  }

  async updateCart(item : ShoppingCartItem)
  {
    let cartUId = await this.getCartId() + "";

    let item$ = this.getCartItem(cartUId , item.product.uId || "");
    item$.update(item);
  }

  async removeFromCart(itemUId : string)
  {
    let cartUId = await this.getCartId() + "";
    this.getCartItem(cartUId, itemUId || "").remove();
  }

  /*---delete existing shopping cart from firebase database based on shopping-cart's unique Id--*/
  async deleteCart() : Promise<boolean>  {
    let cartUId = await this.getCartId() + "";
    return this.db.list('/shopping-carts/'+ cartUId)
                  .remove()
                  .then(()=>true)
                  .catch(()=>false);
  }
}
