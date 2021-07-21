import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { compare , isEmpty , showAlertOnAction } from 'src/app/utility/helper';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})

/*----Products table Component----*/
export class AdminProductsComponent {

  /*----property declarations----*/ 
  products$: Observable<Product[]>;
  products: Product[] | undefined;
  productsCount:number|undefined;

  /*----Initialize properties from firebase database----*/ 
  constructor(private productService: ProductService, private router:Router ) {

    // get list of products from firebase to populate the table
    this.products$ = this.productService.getAll().pipe(map(changes => {
                        this.products = [];
                        this.productsCount = 0;

                        return changes.map((p: any) => {
                            let product = {
                              uId: p.payload.key,
                              title: p.payload.toJSON()['title'],
                              price: Number(p.payload.toJSON()['price']),
                              category: p.payload.toJSON()['category'],
                              imageURL: p.payload.toJSON()['imageURL']
                            } as Product

                            this.products?.push(product);
                            this.productsCount = this.products?.length;
                            return (product);
                          }
                        )
                    }));
  }

  /*----Filter Products table on Search----*/ 
  filterProducts(titleFilter: string , categoryFilter: string) {
    if(this.products)
    {
      let filteredProducts:Product[] = this.products;
      
      if(!isEmpty(titleFilter)  && isEmpty(categoryFilter))
        filteredProducts = this.products.filter((product)=> compare(product.title,titleFilter));

      else if(!isEmpty(categoryFilter) && isEmpty(titleFilter))
        filteredProducts = this.products.filter((product)=> 
                                                compare(product.category.name , categoryFilter) || 
                                                compare(product.category.uId , categoryFilter));
      else if (!isEmpty(categoryFilter) && !isEmpty(titleFilter))
        filteredProducts = this.products.filter((product) => 
                                                compare(product.title , titleFilter) &&
                                                  (compare(product.category.name , categoryFilter) || 
                                                  compare(product.category.uId , categoryFilter)));
    }
  }

  /*----Delete Product----*/ 
  async onDelete(product: Product) {
    if (!confirm("Are you sure you want to delete product " + product.title + "?")) return;
    
    if (product && product.uId) {
      let isDeleted = await this.productService.delete(product.uId);
      showAlertOnAction("Product" , isDeleted , "delete", this.router,"/admin/products")
    }
  }
}
