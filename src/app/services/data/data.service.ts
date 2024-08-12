import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Icurrency {
  currencyCodeA: number;
  currencyCodeB: number;
  rateBuy?: number;
  rateSell?: number;
  rateCross?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'https://api.monobank.ua/bank/currency';

  constructor(private http: HttpClient) {}

  getApiCurrencyData(): Observable<Icurrency[]> {
    return this.http.get<Icurrency[]>(this.apiUrl);
  }
}
