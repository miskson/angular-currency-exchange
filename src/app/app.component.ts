import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExchangeHeaderComponent } from './components/exchange-header/exchange-header.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data/data.service';
import { CurrencyInfo } from './interfaces/data';
import { firstValueFrom, retryWhen, switchMap, throwError, timer } from 'rxjs';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {  NgIf } from '@angular/common';
import { ExchangeInputComponent } from './components/exchange-input/exchange-input.component';
import { ExchangeSelectComponent } from './components/exchange-select/exchange-select.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ExchangeHeaderComponent,
    ExchangeInputComponent,
    ExchangeSelectComponent,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'angular-currency-exchange';

  isLoading: boolean = false;
  loadingMessage: string = 'Loading, please wait...';
  data: CurrencyInfo[] = [];
  dataUah: CurrencyInfo[] = [];

  currentSellCurrency: string = '980';
  currentBuyCurrency: string = '840';

  sellControl = new FormControl(0.1, [
    Validators.required,
    Validators.min(0.001),
  ]);
  buyControl = new FormControl(0.1, [
    Validators.required,
    Validators.min(0.001),
  ]);

  sellSelect = new FormControl('840', [Validators.required]);
  buySelect = new FormControl('840', [Validators.required]);

  sellValue: number = 1;
  buyValue: number = 1;

  constructor(private dataService: DataService) {
    this.sellSelect.valueChanges.subscribe(value => {
      console.log('sell select', value, typeof value)
    })
  }

  trimDigits(num: number) {
    if (!Number.isInteger(num)) {
      let [beforeDot, afterDot] = num.toString().split('.');
      let formated =
        +beforeDot >= 1
          ? beforeDot + '.' + afterDot.slice(0, 2)
          : beforeDot +
            '.' +
            (+afterDot.slice(0, 3) % 10 > 0
              ? afterDot.slice(0, 3)
              : afterDot.slice(0, 2));
      return +formated;
    } else {
      return num;
    }
  }

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
      //if currencies are the same then rate 1-1
      const temp = operation === 'sell' ? +this.sellValue : this.buyValue;
      this.sellValue = temp;
      this.buyValue = temp;
    } else {
      let currentUAHArr: CurrencyInfo[] = [];
      let actualCurrency: CurrencyInfo | undefined;

      if (
        +this.currentSellCurrency === 980 ||
        +this.currentBuyCurrency === 980
      ) {
        // if UAH is present in either sell or buy operation
        // get all currencies with currencyCode === 980 (UAH)
        currentUAHArr = this.data.filter(
          (currency) => currency.currencyCodeB === 980
        );

        actualCurrency = currentUAHArr.find(
          (currency) =>
            +this.currentBuyCurrency === currency.currencyCodeA ||
            +this.currentSellCurrency === currency.currencyCodeA
        );
      }

      if (operation === 'sell') {
        if (currentUAHArr.length > 0) {
          const sellRate =
            +this.currentBuyCurrency === 980
              ? (actualCurrency?.rateSell as number)
              : 1 / (actualCurrency?.rateSell as number);

          this.buyValue = this.trimDigits(
            (this.sellValue as number) * sellRate
          );
        } else {
          actualCurrency = this.data.find(
            (currency) => currency.currencyCodeB !== 980
          );
          let rate =
            +this.currentSellCurrency === actualCurrency?.currencyCodeA
              ? (actualCurrency?.rateSell as number)
              : 1 / (actualCurrency?.rateSell as number);

          this.buyValue = this.trimDigits((this.sellValue as number) * rate);
        }
      } else if (operation === 'buy') {
        if (currentUAHArr.length > 0) {
          const buyRate =
            +this.currentSellCurrency === 980
              ? (actualCurrency?.rateBuy as number)
              : 1 / (actualCurrency?.rateBuy as number);

          this.sellValue = this.trimDigits((this.buyValue as number) * buyRate);
        } else {
          actualCurrency = this.data.find(
            (currency) => currency.currencyCodeB !== 980
          );
          let rate =
            +this.currentBuyCurrency === actualCurrency?.currencyCodeB
              ? 1 / (actualCurrency?.rateBuy as number)
              : (actualCurrency?.rateBuy as number);

          this.sellValue = this.trimDigits((this.buyValue as number) * rate);
        }
      }
    }
  }

  private loadCurrencyData(): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading, please wait...';
    this.getCurrencyData()
      .then(() => {
        this.convertCurrency('sell');
      })
      .catch((err) => {
        console.error(err, 'Failed to load currency data');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  async getCurrencyData(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.dataService.getApiCurrencyData().pipe(
          retryWhen((errors) =>
            errors.pipe(
              switchMap((error) => {
                if (error.status === 429) {
                  console.warn(
                    'Too many requests. Retrying to get data in 30 seconds...'
                  );
                  this.loadingMessage =
                    'Too many requests. Retrying to get data...';
                  return timer(30000);
                }
                return throwError(error);
              })
            )
          )
        )
      );
      this.data = res.filter((currency) => !currency.rateCross);
      this.dataUah = this.data.filter(
        (currency) => currency.currencyCodeB === 980
      );
    } catch (err) {
      console.error(err, 'Request error!');
    }
  }

  ngOnInit(): void {
    this.loadCurrencyData();
  }
}
