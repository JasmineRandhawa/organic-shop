import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable()

/*--Product Service to get/save/update/delete product data from firebase database--*/
export class ProductService {

  /*---Inject angular fire database--*/
  constructor(private db: AngularFireDatabase) {

  }

  /*---get product from firebase database based on product's unique Id--*/
  get(productUId: string) : Observable<SnapshotAction<unknown>> {
    return this.db.object('/products/' + productUId)
                  .snapshotChanges()
  }

  /*---get all products from firebase database--*/
  getAll() : Observable<Product[]> {
    return this.db.list<Product>('products').valueChanges();
  }

  /*---save new product to firebase database--*/
  save(product: any) : string | null {
    let newKey = this.db.list('/products/')
                        .push(product).key;
    if(newKey)
    {
      this.getProductRef(newKey).update({uId: newKey });
    }
    return newKey ? newKey : null;
  }

     /*---Get Shopping cart Item based on cartUId---*/
  getProductRef(productUId :string) : AngularFireObject<Product>
  {
     return this.db.object<Product>('/products/'+productUId);
  }
    

  /*---update existing product to firebase database based on product's unique Id--*/
  update(productUId:string, product: any) : Promise<boolean> {
    return this.db.object('/products/'+ productUId)
                  .update(product)
                  .then(()=>true)
                  .catch(()=>false);
  }

  /*---delete existing product from firebase database based on product's unique Id--*/
  delete(productKey: string) : Promise<boolean>  {
    return this.db.list('/products/'+productKey)
                  .remove()
                  .then(()=>true)
                  .catch(()=>false);
  }
}
