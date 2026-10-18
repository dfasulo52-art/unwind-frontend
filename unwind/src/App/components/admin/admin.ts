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
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  prodotti: Prodotto[] = [];
  prodottiFiltrati: Prodotto[] = [];

  categoriaSelezionata: string = 'tutti';
  searchQuery: string = '';

  mostraForm: boolean = false;
  modalitaModifica: boolean = false;
  
  formProdotto: Prodotto = this.getEmptyProdotto();
  fileSelezionato: File | null = null;

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

  apriFormNuovo(): void {
    this.modalitaModifica = false;
    this.formProdotto = this.getEmptyProdotto();
    this.fileSelezionato = null;
    this.mostraForm = true;
  }

  apriFormModifica(prodotto: Prodotto): void {
    this.modalitaModifica = true;
    this.formProdotto = { ...prodotto };
    this.fileSelezionato = null;
    this.mostraForm = true;
  }

  chiudiForm(): void {
    this.mostraForm = false;
    this.formProdotto = this.getEmptyProdotto();
    this.fileSelezionato = null;
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.fileSelezionato = event.target.files[0];
    }
  }

  salvaProdotto(): void {
    const formData = new FormData();
    formData.append('prodotto', new Blob([JSON.stringify(this.formProdotto)], { type: 'application/json' }));
    
    if (this.fileSelezionato) {
      formData.append('foto', this.fileSelezionato);
    }

    if (this.modalitaModifica && this.formProdotto.id) {
      this.http.put<Prodotto>(`${this.apiUrl}/${this.formProdotto.id}`, formData).subscribe({
        next: () => {
          this.caricaTuttiIProdotti();
          this.chiudiForm();
        },
        error: (err) => console.error('Errore modifica:', err)
      });
    } else {
      this.http.post<Prodotto>(this.apiUrl, formData).subscribe({
        next: () => {
          this.caricaTuttiIProdotti();
          this.chiudiForm();
        },
        error: (err) => console.error('Errore salvataggio:', err)
      });
    }
  }

  eliminaProdotto(prodotto: Prodotto): void {
    if (confirm(`Eliminare "${prodotto.titolo}"?`)) {
      this.http.delete(`${this.apiUrl}/${prodotto.id}`).subscribe({
        next: () => {
          this.caricaTuttiIProdotti();
          this.cdr.detectChanges(); // <--- Aggiornamento in tempo reale immediato
        },
        error: (err) => console.error('Errore eliminazione:', err)
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private getEmptyProdotto(): Prodotto {
    return { titolo: '', descrizione: '', prezzo: 0, categoria: 'cartine' };
  }
}