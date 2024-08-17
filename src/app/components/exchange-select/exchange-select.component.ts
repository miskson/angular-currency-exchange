import { Component, Input, forwardRef } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ControlValueAccessorDirective } from '../../control-value-accessor.directive';
import { CurrencyInfo } from '../../interfaces/data';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-exchange-select',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './exchange-select.component.html',
  styleUrl: './exchange-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExchangeSelectComponent),
      multi: true,
    },
  ],
})
export class ExchangeSelectComponent<
  T
> extends ControlValueAccessorDirective<T> {
  @Input() name: string = 'app-select';

  @Input() selectId: string = window.crypto.randomUUID();

  @Input() options: CurrencyInfo[] = [];

  @Input() value: number = this.control?.value;

  currencyCodes: { [key: string]: string } = {
    '980': 'UAH',
    '840': 'USD',
    '978': 'EUR',
  };
}
