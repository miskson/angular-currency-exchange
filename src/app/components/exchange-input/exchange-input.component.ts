import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-exchange-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, CommonModule],
  templateUrl: './exchange-input.component.html',
  styleUrl: './exchange-input.component.scss',
})
export class ExchangeInputComponent {
  @Input() name: string = 'app-input';

  @Input() minValue: number = 0.1;

  @Input() stepValue: number = 0.1;

  @Input() inputId: string = window.crypto.randomUUID();

  @Input() control: FormControl = new FormControl();

  @Output() onValueChange: EventEmitter<string> = new EventEmitter<string>();

  onChange!: (value: number) => void;

  onTouched!: () => void;

  inputValue: number = 0.1;

  errorMessages: Record<string, string> = {
    required: 'This field is required.',
    min: 'Values must be positive.',
  };
}
