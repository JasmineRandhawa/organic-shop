import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
 /*----Product Form component for creating new product or updating existing product----*/ 
export class ProductFormComponent implements OnDestroy {

  /*----property declarations----*/ 
  paramId: string | undefined;
  subscription:Subscription | undefined;
  categories: Category[] | undefined;
  categories$: Observable<Category[]> | undefined;
  currentProduct: Product  = { uId : "" , title : "" , price :undefined, 
                               imageURL :"" , category :{uId :"" , name:""} };

  /*----initialize properties from firebase----*/ 
  constructor(private categoryService: CategoryService, private productService: ProductService,
              private router: Router, private route: ActivatedRoute) {

    // get product categories from firebase to populate product category dropdown
    this.categories$ = this.categoryService.getAll()
                                           .pipe(map(categoriesSnapshot => {
                                              this.categories = [];
                                              return categoriesSnapshot.map( (categorySnalshot: any) => 
                                              {
                                                let category = { uId: categorySnalshot.payload.key, 
                                                                 name: categorySnalshot.payload.toJSON()['name'] 
                                                               } as Category
                                                this.categories?.push(category);
                                                return category;
                                              }
                                            )
                                          }));
    
    //get param from the URL to get the product id for product to be updated                                            
    this.paramId = this.route.snapshot.paramMap.get("id") as string | "";

    //get existing product from firebase matching the above param id                                 
    if(this.paramId)
      this.subscription = this.productService.get(this.paramId).subscribe((p: any) => {
                            let category = p.payload.toJSON()['category']
                            this.currentProduct = ( { uId: p.payload.key as string,
                                                      title: p.payload.toJSON()['title'] as string,
                                                      price: Number(p.payload.toJSON()['price']),
                                                      category: {uId : category['uId'] ,name :category['name']} as Category,
                                                      imageURL: p.payload.toJSON()['imageURL'] as string }
                                                  ) as Product;
                            
                          });
  }

  /*----update selected category on category dropdown change----*/ 
  onCategoryChange(categoryValue:any)
  {
    let uId = this.categories?.filter((c)=>c.name == categoryValue ).map((c)=>c.uId)[0];
    if(uId)
      this.currentProduct.category.uId = uId
  }

  /*----save new  or update existing product----*/ 
  async onSave(product: any) {
 
    let objToBeSaved =  { title : product.title.trim() , 
                          price : product.price, 
                          category :{uId :this.currentProduct?.category.uId.trim() ,
                                     name:this.currentProduct?.category.name.trim()},
                          imageURL :product.imageURL.trim() };
    
    //update existing object
    if (this.paramId) {
      let isUpdated = await this.productService.update(this.currentProduct.uId || "" , objToBeSaved);
      showAlertOnAction("Product", isUpdated,"update",this.router,'/admin/products');
    }
    
    //save new object
    else {
      let newKey = await this.productService.save(objToBeSaved);
      showAlertOnAction("Product", newKey,"save",this.router,'/admin/products');
    }
  }

  /*----unsubscribe from product service on component destruction----*/ 
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
