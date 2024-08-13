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

  currentSellCurrency: string = '840';
  currentBuyCurrency: string = '980';
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
    // this.sellValue = +(e.target as HTMLInputElement).value;
    this.sellValue = value;
    this.convertCurrency('sell');
  }

  onBuyInputChange(value: number): void {
    // this.buyValue = +(e.target as HTMLInputElement).value;
    this.buyValue = value;
    this.convertCurrency('buy');
  }

  convertCurrency(operation: 'sell' | 'buy') {
    if (+this.currentBuyCurrency === +this.currentSellCurrency) {
      const temp = operation === 'sell' ? +this.sellValue : this.buyValue;
      this.sellValue = temp;
      this.buyValue = temp;
    } else {
      console.log('ELSE BLOCK');
      let currentHrnArr: CurrencyInfo[] = [];
      let actualCurrency: CurrencyInfo | undefined;

      // console.log(
      //   'CURRENCY CONVERT',
      //   operation,
      //   'currentSellCurrency',
      //   this.currentSellCurrency,
      //   'currentBuyCurrency',
      //   this.currentBuyCurrency
      // );

      if (
        +this.currentSellCurrency === 980 ||
        +this.currentBuyCurrency === 980
      ) {
        currentHrnArr = this.data.filter(
          (currency) => currency.currencyCodeB === 980
        );
      }

      if (operation === 'sell') {
        console.log('sell');
        console.log(
          'currentHrnArr.length',
          currentHrnArr.length,
          currentHrnArr
        );

        if (currentHrnArr.length > 0) {
          actualCurrency = currentHrnArr.find(
            (currency) => +this.currentBuyCurrency === currency.currencyCodeA
          );

          this.buyValue =
            (this.sellValue as number) / (actualCurrency?.rateSell as number);
        } else {
          actualCurrency = this.data.find(
            (currency) => currency.currencyCodeB !== 980
          );
          this.buyValue =
            (this.sellValue as number) / (actualCurrency?.rateSell as number);
        }
      } else if ('buy') {
        console.log('buy');
        if (currentHrnArr.length > 0) {
          actualCurrency = currentHrnArr.find(
            (currency) => +this.currentSellCurrency === currency.currencyCodeA
          );

          this.sellValue =
            (this.buyValue as number) * (actualCurrency?.rateBuy as number);
        } else {
          actualCurrency = this.data.find(
            (currency) => currency.currencyCodeB !== 980
          );
          this.sellValue =
            (this.buyValue as number) * (actualCurrency?.rateBuy as number);
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
      console.log('RES', this.data, this.dataUah);
    } catch (err) {
      console.error(err, 'Request error!');
    }
  }

  async ngOnInit(): Promise<void> {
    await this.getCurrencyData();
    this.convertCurrency('sell');
  }
}
