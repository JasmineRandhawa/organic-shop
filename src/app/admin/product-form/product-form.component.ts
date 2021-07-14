import { Category } from './../../models/category';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from './../../Services/category.service';
import { Component, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})

export class ProductFormComponent implements OnDestroy {

  paramId: string | undefined;
  subscription:Subscription | undefined;
  selectedCategory: Category = {uId :"fruits" , name:"Fruits"};
  categories$: Observable<Category[]> | undefined;
  currentProduct: Product  = 
  { uId : "" , title : "" , price :undefined, imageURL :"" , category :{uId :"" , name:""} };


  constructor(private categoryService: CategoryService, private productService: ProductService
    , private router: Router, private route: ActivatedRoute) {
    this.categories$ = this.categoryService.getCategories().pipe(map(changes => {
      return changes.map(
        (
          c: any) => ({ uId: c.payload.key, name: c.payload.toJSON()['name'] } as Category)
      )
    }));
    this.paramId = this.route.snapshot.paramMap.get("id") as string | "";
/*     this.currentProduct$ = this.productService.get(this.paramId).pipe(map((
      p: any) => ({
        uId: p.payload.key as string,
        title: p.payload.toJSON()['title'] as string,
        price: Number(p.payload.toJSON()['price']),
        category: p.payload.toJSON()['category'] as Category,
        imageURL: p.payload.toJSON()['imageURL'] as string
      }) as Product
    )).toPromise();
 */
    this.subscription = this.productService.get(this.paramId).subscribe((
      p: any) => {
        let category = p.payload.toJSON()['category']
       // this.selectedCategory = {uId : category['uId'] ,name :category['name']} as Category;
        this.currentProduct = ({
        uId: p.payload.key as string,
        title: p.payload.toJSON()['title'] as string,
        price: Number(p.payload.toJSON()['price']),
        category: {uId : category['uId'] ,name :category['name']} as Category,
        imageURL: p.payload.toJSON()['imageURL'] as string
      }) as Product;
    });
  }

  onCategoryChange(category:Category)
  {
    this.selectedCategory = category;
  }


  async onSave(product: any) {
    //update existing object
    if (this.paramId) {
      let objToBeUpdated = { title : product.title , 
                             price : product.price, 
                             category :{uId :this.selectedCategory?.uId , name:this.selectedCategory?.name},
                             imageURL :product.imageURL };
      console.log(objToBeUpdated);
      console.log(this.currentProduct.uId);
      let isUpdated = await this.productService.update(this.currentProduct.uId || "" , objToBeUpdated);
      console.log(isUpdated);
      if(isUpdated)
      {
        alert("Product updated successfully!");
        this.router.navigate(['admin/products']);
      }
      else
        alert("Update failed");
    }
    //save new object
    else {
      if (this.selectedCategory)
        product.category = { uId: this.selectedCategory.uId, name: this.selectedCategory.name }
      let newKey = await this.productService.save(product);
      if (newKey) {
        alert("Product saved successfully!");
        this.router.navigate(['admin/products']);
      }
      else
        alert("Save failed");
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
