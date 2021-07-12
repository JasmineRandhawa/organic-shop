import { CategoryService } from './../../Services/category.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from 'src/app/models/category';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})

export class ProductFormComponent  {
  
  categories$: Observable<Category[]> | undefined

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getCategories().pipe(map(changes => {
                        return changes.map(
                          (
                            c:any) => ({ uId: c.payload.key, name:c.payload.toJSON()['name']} as Category)
                          )
                      }));
  }

}
