import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { compare , isEmpty , showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})

/*----Products table Component----*/
export class AdminProductsComponent  implements OnDestroy{

  /*----property declarations----*/ 
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productSubscription: Subscription;

  /*----Initialize properties from firebase database----*/ 
  constructor(private productService: ProductService, private router:Router) {

    // get list of products from firebase to populate the table
        // get list of products from firebase to populate the table
    this.productSubscription = this.productService
                                   .getAll()
                                   .subscribe((products) => {
                                    this.products = [];
                                    this.filteredProducts = [];

                                    products.map((product:Product)=>
                                    {
                                      this.products.push(product);
                                      this.filteredProducts.push(product);
                                    })
                                  });
  }

  get isAnyProducts()
  {
    return this.filteredProducts.length > 0
  }

  /*----Filter Products table on Search----*/ 
  filterProducts(titleFilter: string , categoryFilter: string) {
    if(this.products)
    {
      this.filteredProducts = this.products;
      
      if(!isEmpty(titleFilter)  && isEmpty(categoryFilter))
        this.filteredProducts = this.products.filter((product)=> compare(product.title,titleFilter));

      else if(!isEmpty(categoryFilter) && isEmpty(titleFilter))
        this.filteredProducts = this.products.filter((product)=> 
                                                compare(product.category.name , categoryFilter) || 
                                                compare(product.category.uId , categoryFilter));
      else if (!isEmpty(categoryFilter) && !isEmpty(titleFilter))
        this.filteredProducts = this.products.filter((product) => 
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

  /*----Unsubscribe from product service one the product list component is destroyed----*/ 
  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }
}
