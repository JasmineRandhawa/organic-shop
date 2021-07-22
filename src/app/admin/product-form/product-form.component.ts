import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';

import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SnapshotAction } from '@angular/fire/database';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
 /*---Product Form component for creating new product or updating existing product---*/ 
export class ProductFormComponent implements OnDestroy {

  /*---class property declarations---*/ 
  paramId: string = "";
  categories: Category[] = [];
  currentProduct: Product  = new Product();
  categories$: Observable<Category[]> | undefined;
  productSubscription:Subscription | undefined;

  /*----initialize properties from firebase----*/ 
  constructor(private categoryService: CategoryService, private router: Router,
              private productService: ProductService, private route: ActivatedRoute) {

    // get product categories from firebase to populate product category dropdown
    this.categories$ =  this.categoryService
                            .getAll()
                            .pipe(map(categories => 
                               this.populateCategories(categories)
                             ));
    
    //get param from the URL to get the product id for product to be updated                                            
    this.paramId = this.route.snapshot.paramMap.get("id") as string | "";

    //get existing product from firebase matching the above param id                                 
    if(this.paramId)
      this.productSubscription =  this.productService
                                      .get(this.paramId)
                                      .subscribe((product:Product | null) => {
                                        if(product)
                                          this.currentProduct = product;
                                      });
  }

  /*---populate categories list for dropdown---*/ 
  private populateCategories(categories:SnapshotAction<any>[])
  {
    this.categories = [];
    return categories.map((category: any) => {
        let categoryObj = { uId: category.payload.key, 
                            name: category.payload.toJSON()['name'] 
                          } as Category
        this.categories.push(categoryObj);
        return categoryObj;
      }
    )
  }

  /*---update selected category on category dropdown change---*/ 
  onCategoryChange(categoryValue:any)
  {
    let uId = this.categories
                  .filter((c)=>c.name == categoryValue)
                  .map((c)=>c.uId)[0];
    if(uId)
      this.currentProduct.category.uId = uId
  }

  /*---save new  or update existing product---*/ 
  async onSave(product: any) {
 
    let objToBeSaved =  { title : product.title.trim() , 
                          price : product.price, 
                          category : this.currentProduct.category,
                          imageURL :product.imageURL.trim() };
    
    //update existing object
    if (this.paramId) {
      let isUpdated = await this.productService
                                .update(this.currentProduct.uId , objToBeSaved);
      showAlertOnAction("Product", isUpdated,"update",this.router,'/admin/products');
    }
    
    //save new object
    else {
      let newProductId = await this.productService.save(objToBeSaved);
      showAlertOnAction("Product", newProductId,"save",this.router,'/admin/products');
    }
  }

  /*---unsubscribe from product service on component destruction---*/ 
  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }
}
