import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: boolean = false;
  // Aggiornato con l'URL del backend su Render
  private apiUrl = 'https://unwind-backend-i6c8.onrender.com/api/admin/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap({
        next: () => {
          this.loggedIn = true;
          localStorage.setItem('isAdminLoggedIn', 'true');
        },
        error: () => {
          this.loggedIn = false;
          localStorage.removeItem('isAdminLoggedIn');
        }
      })
    );
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('isAdminLoggedIn');
  }

  isLoggedIn(): boolean {
    return this.loggedIn || localStorage.getItem('isAdminLoggedIn') === 'true';
  }
}