import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prodotto } from '../models/prodotto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/prodotti';

  constructor(private http: HttpClient) {}

  getProdotti(categoria?: string): Observable<Prodotto[]> {
    let url = this.apiUrl;
    if (categoria && categoria !== 'tutti') {
      url += `?categoria=${categoria}`;
    }
    return this.http.get<Prodotto[]>(url);
  }
}