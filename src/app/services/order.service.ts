import { Order } from 'src/app/models/order';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

import { Observable } from 'rxjs';

@Injectable()

 /*---Order Service to get/save/update/delete order data from firebase database---*/
export class OrderService {

  /*---Inject angular fire database---*/
  constructor(private db: AngularFireDatabase) {
  }

  /*---get all orders from firebase database---*/
  getAll() : Observable<Order[]> {
    return this.db.list<Order>('orders').valueChanges();
  }

  /*---get order from firebase database based on drder's unique Id---*/
  get(orderUId : string) : Observable<Order|null> {
    return this.getOrderRef(orderUId).valueChanges();
  }
  
  /*---save new order to firebase database---*/
  save(order: any) : string | null {
    let newKey = this.db.list('/orders/')
                        .push(order).key;
    if(newKey)
      this.getOrderRef(newKey).update({orderUId: newKey });

    return newKey ? newKey : null;
  }

  /*---delete existing order from firebase database based on order's unique Id---*/
  delete(orderUId : string) : Promise<boolean>  {
    return  this.getOrderRef(orderUId)
                .remove()
                .then(()=>true)
                .catch(()=>false);
  }

  /*---------------------------Private Methods-------------------------*/
  
  /*---Get order ref based on orderUId---*/
  private getOrderRef(orderUId : string) : AngularFireObject<Order> {
    return this.db.object<Order>('/orders/'+orderUId);
  }

  /*-------------------------------------------------------------------*/
}
