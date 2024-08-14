import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExchangeHeaderComponent } from './components/exchange-header/exchange-header.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data/data.service';
import { CurrencyInfo } from './interfaces/data';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ExchangeHeaderComponent,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'angular-currency-exchange';

  constructor(private dataService: DataService) {}

  data: CurrencyInfo[] = [];
  dataUah: CurrencyInfo[] = [];

  currentSellCurrency: string = '980';
  currentBuyCurrency: string = '840';
  sellValue: number = 1;
  buyValue: number = 1;

  onSellCurrencyChange(e: Event): void {
    this.currentSellCurrency = (e.target as HTMLInputElement).value;
    this.convertCurrency('sell');
  }

  onBuyCurrencyChange(e: Event): void {
    this.currentBuyCurrency = (e.target as HTMLInputElement).value;
    this.convertCurrency('buy');
  }

  onSellInputChange(value: number): void {
    this.sellValue = value;
    this.convertCurrency('sell');
  }

  onBuyInputChange(value: number): void {
    this.buyValue = value;
    this.convertCurrency('buy');
  }

  convertCurrency(operation: 'sell' | 'buy') {
    if (+this.currentBuyCurrency === +this.currentSellCurrency) {
      const temp = operation === 'sell' ? +this.sellValue : this.buyValue;
      this.sellValue = temp;
      this.buyValue = temp;
    } else {
      let currentHrnArr: CurrencyInfo[] = [];
      let actualCurrency: CurrencyInfo | undefined;

      if (
        +this.currentSellCurrency === 980 ||
        +this.currentBuyCurrency === 980
      ) {
        currentHrnArr = this.data.filter(
          (currency) => currency.currencyCodeB === 980
        );
      }

      if (operation === 'sell') {
        if (currentHrnArr.length > 0) {
          actualCurrency = currentHrnArr.find(
            (currency) =>
              +this.currentBuyCurrency === currency.currencyCodeA ||
              +this.currentSellCurrency === currency.currencyCodeA
          );

          const sellRate =
            +this.currentBuyCurrency === 980
              ? (actualCurrency?.rateSell as number)
              : 1 / (actualCurrency?.rateSell as number);

          this.buyValue = (this.sellValue as number) * sellRate;

        } else {
          actualCurrency = this.data.find(
            (currency) => currency.currencyCodeB !== 980
          );
          let rate =
            +this.currentSellCurrency === actualCurrency?.currencyCodeA
              ? (actualCurrency?.rateSell as number)
              : 1 / (actualCurrency?.rateSell as number);

          this.buyValue = (this.sellValue as number) * rate;
        }
      } else if (operation === 'buy') {
        if (currentHrnArr.length > 0) {
          actualCurrency = currentHrnArr.find(
            (currency) =>
              +this.currentBuyCurrency === currency.currencyCodeA ||
              +this.currentSellCurrency === currency.currencyCodeA
          );

          const buyRate =
            +this.currentSellCurrency === 980
              ? (actualCurrency?.rateBuy as number)
              : 1 / (actualCurrency?.rateBuy as number);

          this.sellValue = (this.buyValue as number) * buyRate;
        } else {
          actualCurrency = this.data.find(
            (currency) => currency.currencyCodeB !== 980
          );
          let rate =
            +this.currentBuyCurrency === actualCurrency?.currencyCodeB
              ? 1 / (actualCurrency?.rateBuy as number)
              : (actualCurrency?.rateBuy as number);
          this.sellValue = (this.buyValue as number) * rate;
        }
      }
    }
  }

  async getCurrencyData(): Promise<void> {
    try {
      const res = await firstValueFrom(this.dataService.getApiCurrencyData());
      this.data = res.filter((currency) => !currency.rateCross);
      this.dataUah = this.data.filter(
        (currency) => currency.currencyCodeB === 980
      );
    } catch (err) {
      console.error(err, 'Request error!');
    }
  }

  async ngOnInit(): Promise<void> {
    await this.getCurrencyData();
    this.convertCurrency('sell');
  }
}
