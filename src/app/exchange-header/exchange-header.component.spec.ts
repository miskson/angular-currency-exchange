import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeHeaderComponent } from './exchange-header.component';

describe('ExchangeHeaderComponent', () => {
  let component: ExchangeHeaderComponent;
  let fixture: ComponentFixture<ExchangeHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExchangeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
