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
  sellValue?: string = '1';
  buyValue?: string = '1';

  onSellCurrencyChange(e: Event): void {
    this.currentSellCurrency = (e.target as HTMLInputElement).value;
    this.convertCurrency('sell');
  }

  onBuyCurrencyChange(e: Event): void {
    this.currentBuyCurrency = (e.target as HTMLInputElement).value;
    this.convertCurrency('buy');
  }

  onSellInputChange(e: Event): void {
    this.sellValue = (e.target as HTMLInputElement).value;
    this.convertCurrency('sell');
  }

  onBuyInputChange(e: Event): void {
    this.buyValue = (e.target as HTMLInputElement).value;
    this.convertCurrency('buy');
  }

  convertCurrency(operation: 'sell' | 'buy') {
    if (+this.currentBuyCurrency === +this.currentSellCurrency) {
      const temp = this.sellValue;
      this.sellValue = this.buyValue;
      this.buyValue = temp;
    }

    // to fix
    if (operation === 'buy') {
      if (+this.currentBuyCurrency === +this.currentSellCurrency) {
        this.buyValue = this.sellValue + '';
        return;
      }
    } else if ('sell') {
      if (+this.currentBuyCurrency === +this.currentSellCurrency) {
        this.sellValue = this.buyValue;
        this.buyValue = this.sellValue;
        return;
      }
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
  }
}
