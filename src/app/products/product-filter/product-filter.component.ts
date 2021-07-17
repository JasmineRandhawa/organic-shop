import { Category } from 'src/app/models/category';
import { CATEGORY_ALL } from 'src/app/constants';
import { CategoryService } from 'src/app/services/category.service';

import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})

/* Products category filter */
export class ProductFilterComponent{

   /*----property declarations----*/ 
  categories$: Observable<Category[]> | undefined;
  defaultCategory = CATEGORY_ALL
  @Input('category') category:string = this.defaultCategory;

  /*----subscribe to query param----*/ 
  constructor(private categoryService: CategoryService, private route:ActivatedRoute ) 
  {
    // get product categories from firebase to populate product category list
    this.categories$ =  this.categoryService.getAll()
                              .pipe(map(categoriesSnapshot => {
                                return categoriesSnapshot.map( (categorySnalshot: any) => 
                                {
                                  let category = { uId: categorySnalshot.payload.key, 
                                                    name: categorySnalshot.payload.toJSON()['name'] 
                                                  } as Category
                                  return category;
                                }
                              )
            }));
  }
}
