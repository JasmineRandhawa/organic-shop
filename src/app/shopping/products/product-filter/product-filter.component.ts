import { Category } from 'src/app/models/category';
import { CATEGORY_ALL } from 'src/app/utility/constants';
import { CategoryService } from 'src/app/services/category.service';

import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})

/*---Products category filter---*/
export class ProductFilterComponent{

   /*---class property declarations---*/ 
  categories$: Observable<Category[]> | undefined;
  defaultCategory = CATEGORY_ALL
  @Input('category') category:string = this.defaultCategory;

  /*----subscribe to query param----*/ 
  constructor(private categoryService: CategoryService) 
  {
    // get product categories from firebase to populate product category list
    this.categories$ =  this.categoryService
                            .getAll()
                            .pipe(map(categories => {
                                return categories.map( (category: any) => 
                                {
                                  let categoryObj = { uId: category.payload.key, 
                                                      name: category.payload.toJSON()['name'] 
                                                    } as Category
                                  return categoryObj;
                                }
                              )
                            }));
  }
}
