import { Directive, Inject, Injector, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appControlValueAccessor]',
  standalone: true,
})
export class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit
{
  control: FormControl | undefined;
  isRequired = false;

  private onChange = (value: any) => {};
  private _destroy$ = new Subject<void>();
  private _onTouched!: () => T;

  constructor(@Inject(Injector) private injector: Injector) {}

  ngOnInit() {
    const ngControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control as FormControl;
      if (this.control) {
        this.control.valueChanges
          .pipe(takeUntil(this._destroy$))
          .subscribe((value) => this.onChange(value));
      }
    } else {
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
    if (!this.control) {
      this.control = new FormControl(value);
    }
  }

  registerOnChange(fn: (val: T | null) => T): void {
    this.control?.valueChanges;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
}
