import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExchangeHeaderComponent } from "./exchange-header/exchange-header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExchangeHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-currency-exchange';
}
