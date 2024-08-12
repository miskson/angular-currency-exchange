import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExchangeHeaderComponent } from './components/exchange-header/exchange-header.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data/data.service';

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

  data: any = [];

  getCurrencyData() {
    this.dataService.getApiCurrencyData().subscribe(
      (res) => {
        console.log('RES', res);
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
