import { AppUser } from 'src/app/models/app-user';
import { LoggedInUser } from 'src/app/models/logged-in-user';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { ShoppingCart } from 'src/app/models/shopping-cart';

import { AuthService } from 'src/app/services/auth.service';
import { isEmpty,getCurrentDate, getCartIdFromLocalStorage } from 'src/app/utility/helper';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()

/*---Shopping Cart Service to get/save/update/delete 
     shopping-cart data from firebase database---*/
export class ShoppingCartService {

  /*---class property declarations---*/
  appUser : AppUser = new AppUser();
  userSubscription: Subscription;

  /*---Inject angular fire database---*/
  constructor(private db: AngularFireDatabase, private authService:AuthService) {
    //get loggedinUser
    this.userSubscription = this.authService
                                .appUser$
                                .pipe(take(1))
                                .subscribe((appUser :AppUser | null) => {
                                  if(appUser) this.appUser = appUser
                                 });
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
    return this.getCartRef(cartUId)
              .remove()
              .then(()=>true)
              .catch(()=>false);
  }

  /*---------------------------Private Methods-------------------------*/
  /*---create new cart in firebase database---*/
  private createCartId() : string
  {
    let loggedInUser = new LoggedInUser(this.appUser.uId,this.appUser.name);
    let shoppingCart = new ShoppingCart({} ,"" , loggedInUser , getCurrentDate());
    let cartUId = this.createCart (shoppingCart);

    if(!isEmpty(cartUId)) 
    {
      localStorage.setItem('cartUId', cartUId);
      this.getCartRef(cartUId).update( { uId: cartUId });
    }
    return cartUId;
  }
  
  /*---add new cart to shopping-carts table in firebase database---*/
  private createCart(shoppingCart : ShoppingCart) : string {
     return this.db.list('/shopping-carts/').push(shoppingCart).key || ""
  }
  
  /*---create or get cartUId from firebase database---*/
  private async getCartId() : Promise<string | null> {
  
    //get shoppign cart if from local storage is any
    let cartUId = getCartIdFromLocalStorage();
    if(!isEmpty(cartUId)) 
      return cartUId;
    
    // create a cart entry and save the new cart's unique Id in local storage
    cartUId = await this.createCartId();
    return cartUId;
  }

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
