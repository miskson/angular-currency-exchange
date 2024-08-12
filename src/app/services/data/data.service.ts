import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyInfo } from '../../interfaces/data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'https://api.monobank.ua/bank/currency';

  constructor(private http: HttpClient) {}

  getApiCurrencyData(): Observable<CurrencyInfo[]> {
    return this.http.get<CurrencyInfo[]>(this.apiUrl);
  }
}
