import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

export interface Prodotto {
  id?: number;
  titolo: string;
  descrizione: string;
  prezzo: number;
  categoria: string;
  foto?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  prodotti: Prodotto[] = [];
  prodottiFiltrati: Prodotto[] = [];

  categoriaSelezionata: string = 'tutti';
  searchQuery: string = '';

  prodottoSelezionato: Prodotto | null = null;
  mostraLoginModal: boolean = false;
  emailInput: string = '';
  passwordInput: string = '';
  loginError: boolean = false;

  private apiUrl = 'http://localhost:8080/api/prodotti';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caricaTuttiIProdotti();
  }

  caricaTuttiIProdotti(): void {
    this.http.get<Prodotto[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.prodotti = data || [];
        this.applicaFiltroRicerca();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore caricamento prodotti:', err)
    });
  }

  caricaProdotti(categoria: string): void {
    this.categoriaSelezionata = categoria;
    this.applicaFiltroRicerca();
  }

  applicaFiltroRicerca(): void {
    const query = this.searchQuery ? this.searchQuery.toLowerCase().trim() : '';
    const catSelezionata = this.categoriaSelezionata ? this.categoriaSelezionata.toLowerCase().trim() : 'tutti';

    this.prodottiFiltrati = this.prodotti.filter(p => {
      const catProdotto = p.categoria ? p.categoria.toLowerCase().trim() : '';
      const corrispondeCategoria = catSelezionata === 'tutti' || catProdotto === catSelezionata;
      const corrispondeRicerca = !query || p.titolo?.toLowerCase().includes(query) || p.descrizione?.toLowerCase().includes(query);
      return corrispondeCategoria && corrispondeRicerca;
    });
  }

  apriDettagli(prodotto: Prodotto): void {
    this.prodottoSelezionato = prodotto;
  }

  chiudiDettagli(): void {
    this.prodottoSelezionato = null;
  }

  apriLoginModal(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin']);
    } else {
      this.emailInput = '';
      this.passwordInput = '';
      this.loginError = false;
      this.mostraLoginModal = true;
    }
  }

  chiudiLoginModal(): void {
    this.mostraLoginModal = false;
    this.loginError = false;
  }

  eseguiLogin(): void {
    if (!this.emailInput || !this.passwordInput) {
      this.loginError = true;
      return;
    }

    this.authService.login(this.emailInput, this.passwordInput).subscribe({
      next: () => {
        this.loginError = false;
        this.mostraLoginModal = false;
        this.cdr.detectChanges();
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Credenziali non valide o errore server:', err);
        this.loginError = true;
        this.cdr.detectChanges();
      }
    });
  }
}