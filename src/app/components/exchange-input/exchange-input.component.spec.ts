import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeInputComponent } from './exchange-input.component';

describe('ExchangeInputComponent', () => {
  let component: ExchangeInputComponent;
  let fixture: ComponentFixture<ExchangeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExchangeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
