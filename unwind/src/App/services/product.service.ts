import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prodotto } from '../models/prodotto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Aggiunto /api/prodotti alla fine dell'URL
  private apiUrl = 'https://unwind-backend-i6c8.onrender.com/api/prodotti';

  constructor(private http: HttpClient) {}

  getProdotti(categoria?: string): Observable<Prodotto[]> {
    let url = this.apiUrl;
    if (categoria && categoria !== 'tutti') {
      url += `?categoria=${categoria}`;
    }
    return this.http.get<Prodotto[]>(url);
  }
}