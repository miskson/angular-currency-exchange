import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExchangeHeaderComponent } from './components/exchange-header/exchange-header.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data/data.service';
import { CurrencyInfo } from './interfaces/data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExchangeHeaderComponent, HttpClientModule],
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
  sellValue?: number = 1;
  buyValue?: number = 1;

  onSellCurrencyChange(e: Event): void {
    this.currentSellCurrency = (e.target as HTMLInputElement).value;
    this.convertCurrency('sell');
  }

  onBuyCurrencyChange(e: Event): void {
    this.currentBuyCurrency = (e.target as HTMLInputElement).value;
    this.convertCurrency('buy');
  }

  onSellInputChange(e: Event): void {
    this.sellValue = +(e.target as HTMLInputElement).value;
    this.convertCurrency('sell');
  }

  onBuyInputChange(e: Event): void {
    this.buyValue = +(e.target as HTMLInputElement).value;
    this.convertCurrency('buy');
  }

  convertCurrency(operation: 'sell' | 'buy') {
    if (+this.currentBuyCurrency === +this.currentSellCurrency) {
      const temp = this.sellValue;
      this.sellValue = this.buyValue;
      this.buyValue = temp;
    }

    let currentHrnArr: CurrencyInfo[] = [];
    let actualCurrency: CurrencyInfo | undefined;

    console.log(
      'CURRENCY CONVERT',
      operation,
      'currentSellCurrency',
      this.currentSellCurrency,
      'currentBuyCurrency',
      this.currentBuyCurrency
    );

    if (+this.currentSellCurrency === 980 || +this.currentBuyCurrency === 980) {
      currentHrnArr = this.data.filter(
        (currency) => currency.currencyCodeB === 980
      );
      console.log('currentHrnArr', currentHrnArr);
    }
    // to fix

    if (operation === 'sell') {
      console.log('sell');

      console.log('currentHrnArr.length', currentHrnArr.length, currentHrnArr);
      if (currentHrnArr.length > 0) {
        actualCurrency = currentHrnArr.find(
          (currency) => +this.currentBuyCurrency === currency.currencyCodeA
        );

        this.buyValue =
          (this.sellValue as number) / (actualCurrency?.rateSell as number);

        console.log('ACTUAL ARR', actualCurrency, this.buyValue);
      } else {
        actualCurrency = this.data.find(
          (currency) => currency.currencyCodeB !== 980
        );
        this.buyValue =
          (this.sellValue as number) / (actualCurrency?.rateSell as number);
      }
    } else if ('buy') {
      console.log('buy');
    }
  }

  getCurrencyData() {
    this.dataService.getApiCurrencyData().subscribe(
      (res) => {
        this.data = res.filter((currency) => {
          return currency.rateCross ? false : true;
        });
        this.dataUah = this.data.filter((currency) => {
          return currency.currencyCodeB === 980;
        });

        console.log('RES', this.data, this.dataUah);
      },
      (err) => {
        console.error(err, 'REQUES ERROR');
      }
    );
  }

  ngOnInit(): void {
    this.getCurrencyData();
    this.convertCurrency('sell');
  }
}
