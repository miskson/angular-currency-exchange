import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeSelectComponent } from './exchange-select.component';

describe('ExchangeSelectComponent', () => {
  let component: ExchangeSelectComponent;
  let fixture: ComponentFixture<ExchangeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExchangeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
