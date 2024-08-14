import { Component, Input } from '@angular/core';
import { CurrencyInfo } from '../../interfaces/data';

@Component({
  selector: 'app-exchange-header',
  standalone: true,
  imports: [],
  templateUrl: './exchange-header.component.html',
  styleUrl: './exchange-header.component.scss',
})
export class ExchangeHeaderComponent {
  @Input() currencies?: CurrencyInfo[];

  currencyCodes: { [key: string]: string } = {
    '980': 'UAH',
    '840': 'USD',
    '978': 'EUR',
  };

  ngOnInit(): void {}
}
