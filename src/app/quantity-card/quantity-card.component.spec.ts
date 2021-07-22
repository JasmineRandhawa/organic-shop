import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityCardComponent } from './quantity-card.component';

describe('QuantityCardComponent', () => {
  let component: QuantityCardComponent;
  let fixture: ComponentFixture<QuantityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantityCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
