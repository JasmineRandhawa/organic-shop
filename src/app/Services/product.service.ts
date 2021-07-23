import { Product } from 'src/app/models/product';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

import { Observable } from 'rxjs';

@Injectable()

/*---Product Service to get/save/update/delete product data from firebase database---*/
export class ProductService {

  /*---Inject angular fire database---*/
  constructor(private db: AngularFireDatabase) {
  }

  /*---get all products from firebase database---*/
  getAll() : Observable<Product[]> {
    return this.db.list<Product>('products').valueChanges();
  }

  /*---get product from firebase database based on product's unique Id---*/
  get(productUId : string) : Observable<Product|null> {
    return this.getProductRef(productUId).valueChanges();
  }
  
  /*---save new product to firebase database---*/
  save(product: any) : string | null {
    let newKey = this.db.list('/products/')
                        .push(product).key;
    if(newKey)
      this.getProductRef(newKey).update({productUId: newKey });

    return newKey ? newKey : null;
  }

  /*---update existing product to firebase database based on product's unique Id--*/
  update(productUId : string, product : any) : Promise<boolean> {
    return  this.getProductRef(productUId)
                .update(product)
                .then(()=>true)
                .catch(()=>false);
  }

  /*---delete existing product from firebase database based on product's unique Id---*/
  delete(productUId : string) : Promise<boolean>  {
    return  this.getProductRef(productUId)
                .remove()
                .then(()=>true)
                .catch(()=>false);
  }

  /*---------------------------Private Methods-------------------------*/
  
  /*---Get product ref based on productUId---*/
  private getProductRef(productUId : string) : AngularFireObject<Product> {
    return this.db.object<Product>('/products/'+productUId);
  }

  /*-------------------------------------------------------------------*/
}
