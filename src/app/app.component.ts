import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExchangeHeaderComponent } from './components/exchange-header/exchange-header.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data/data.service';
import { CurrencyInfo } from './interfaces/data';
import {
  Subscription,
  firstValueFrom,
  retryWhen,
  switchMap,
  throwError,
  timer,
} from 'rxjs';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
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
  currencyCodesArr: number[] = [];
  private subscriptions: Subscription[] = [];
  isUpdating: boolean = false;

  currentSellCurrency: string = '980';
  currentBuyCurrency: string = '840';

  sellControl = new FormControl(1, [
    Validators.required,
    Validators.min(0.001),
  ]);
  buyControl = new FormControl(0.1, [
    Validators.required,
    Validators.min(0.001),
  ]);

  sellSelect = new FormControl('840', [Validators.required]);
  buySelect = new FormControl('980', [Validators.required]);

  sellValue: number = 1;
  buyValue: number = 1;

  constructor(private dataService: DataService) {
    this.subscriptions.push(
      this.sellSelect.valueChanges.subscribe(() => {
        this.convertValues('sell');
      })
    );

    this.subscriptions.push(
      this.sellControl.valueChanges.subscribe(() => {
        this.convertValues('sell');
      })
    );

    this.subscriptions.push(
      this.buySelect.valueChanges.subscribe(() => {
        this.convertValues('buy');
      })
    );

    this.subscriptions.push(
      this.buyControl.valueChanges.subscribe(() => {
        this.convertValues('buy');
      })
    );
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

  convertValues(operation: 'sell' | 'buy') {
    if (this.isUpdating) return;

    if (this.sellSelect.value === this.buySelect.value) {
      this.isUpdating = true;
      const temp =
        operation === 'sell' ? this.sellControl.value : this.buyControl.value;

      this.sellControl.setValue(temp, { onlySelf: true, emitEvent: false });
      this.buyControl.setValue(temp, { onlySelf: true, emitEvent: false });

      this.isUpdating = false;
    } else {
      let isRevert = false;
      let actualCurrency: CurrencyInfo | undefined = this.data.find((item) => {
        let caseRevert =
          item.currencyCodeA === Number(this.sellSelect.value) &&
          item.currencyCodeB === Number(this.buySelect.value);

        let caseNormal =
          item.currencyCodeA === Number(this.buySelect.value) &&
          item.currencyCodeB === Number(this.sellSelect.value);

        if (caseNormal) {
          return caseNormal;
        } else if (caseRevert) {
          isRevert = true;
          return caseRevert;
        } else {
          return;
        }
      });
      this.isUpdating = true;
      if (operation === 'sell') {
        let buyRate = isRevert
          ? Number(actualCurrency?.rateSell)
          : 1 / Number(actualCurrency?.rateSell);
        this.buyControl.setValue(
          this.trimDigits(Number(this.sellControl.value) * buyRate),
          { onlySelf: true, emitEvent: false }
        );
      } else if ('buy') {
        let sellRate = isRevert
          ? 1 / Number(actualCurrency?.rateBuy)
          : Number(actualCurrency?.rateBuy);
        this.sellControl.setValue(
          this.trimDigits(Number(this.buyControl.value) * sellRate),
          { onlySelf: true, emitEvent: false }
        );
      }
      this.isUpdating = false;
    }
  }

  private loadCurrencyData(): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading, please wait...';
    this.getCurrencyData()
      .then(() => {
        this.convertValues('sell');
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
      this.currencyCodesArr = [
        ...this.data.map((item) => item.currencyCodeA),
        ...this.data.map((item) => item.currencyCodeB),
      ].filter((item, index, rep) => rep.indexOf(item) === index);
    } catch (err) {
      console.error(err, 'Request error!');
    }
  }

  ngOnInit(): void {
    this.loadCurrencyData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
