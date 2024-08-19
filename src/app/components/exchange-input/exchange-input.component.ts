import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from '../../control-value-accessor.directive';

@Component({
  selector: 'app-exchange-input',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf, CommonModule],
  templateUrl: './exchange-input.component.html',
  styleUrl: './exchange-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExchangeInputComponent),
      multi: true,
    },
  ],
})
export class ExchangeInputComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() name: string = 'app-input';

  @Input() minValue: number = 0.1;

  @Input() stepValue: number = 0.1;

  @Input() inputId: string = window.crypto.randomUUID();

  errorMessages: Record<string, string> = {
    required: 'This field is required.',
    min: 'Values must be positive.',
  };
}
