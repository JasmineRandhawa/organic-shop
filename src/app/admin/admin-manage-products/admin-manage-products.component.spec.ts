import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageProductsComponent } from './admin-manage-products.component';

describe('AdminManageProductsComponent', () => {
  let component: AdminManageProductsComponent;
  let fixture: ComponentFixture<AdminManageProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
