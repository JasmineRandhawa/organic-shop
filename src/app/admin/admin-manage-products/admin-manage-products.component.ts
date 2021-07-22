import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { compare , isEmpty , showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableParams, DataTableResource } from 'angular5-data-table'

import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-manage-products',
  templateUrl: './admin-manage-products.component.html',
  styleUrls: ['./admin-manage-products.component.css']
})

/*----Products DataTable Component with pagination sorting----*/
export class AdminManageProductsComponent implements OnDestroy {

  /*----property declarations----*/ 
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productSubscription: Subscription;
  items: Product[] = [];
  itemsCount:number = 0;
  tableResource:DataTableResource<Product> | undefined;

  /*----Initialize properties from firebase database----*/ 
  constructor(private productService: ProductService, private router:Router ) {

    // get list of products from firebase to populate the table
    this.productSubscription =  this.productService
                                    .getAll()
                                    .subscribe((products) => {
                                    this.products = [];
                                    this.filteredProducts = [];

                                    products.map((product:Product)=>
                                    {
                                      this.products.push(product);
                                      this.filteredProducts.push(product);
                                    })

                                    if(this.products.length>0)
                                    {
                                      this.initializeDataTable(this.products);
                                    }
                                  });  
  }

  /*----initializetable or reload datatable after search filters----*/ 
  private initializeDataTable(products:Product[])
  {
    this.tableResource = new DataTableResource(products);
    this.tableResource?.query({offset:0})
                      .then(items=> this.items = items);
    this.tableResource?.count()
                      .then(count=> this.itemsCount = count);
  }

  /*----reload datatable after rezeing, pagination or sorting----*/ 
  reloadItems(params:DataTableParams) : void 
  {
    if(!this.tableResource) return;

    this.tableResource?.query(params)
                       .then(items=> this.items = items);
  }

  /*----navigate to image in new tab----*/ 
  onNavigate(imageURL:string){
    window.open(imageURL, "_blank");
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
      
      
        this.initializeDataTable(filteredProducts);                                          
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

  
  /*----unsubscribe from product service on component destruction----*/ 
  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }
}
