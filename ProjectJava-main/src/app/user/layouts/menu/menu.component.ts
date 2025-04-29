import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  plats: any[] = [];
  activeFilter: string = 'TOUT';

  constructor(private http: HttpClient,   private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPlats('TOUT'); // Charger tous les plats au début
  }
  goToDetails(platId : number)
  {
    this.router.navigate(['/user/menu/'+platId]);

console.log(platId)
  }
  filterItems(categorie: string) {
    this.activeFilter = categorie;
    this.loadPlats(categorie);
  }

  loadPlats(categorie: string) {
    if (categorie === 'TOUT') {
      this.http.get<any>('http://localhost/miniProjet/menu/readAllMenu.php')
        .subscribe({
          next: (data) => {
            if (data.success) {
              this.plats = data.data;
            } else {
              console.error('Erreur de récupération de tous les plats:', data.message);
            }
          },
          error: (err) => {
            console.error('Erreur serveur:', err);
          }
        });
    } else {
      this.http.get<any>(`http://localhost/miniProjet/menu/readMenuByCategorie.php?categorie=${categorie}`)
        .subscribe({
          next: (data) => {
            if (data.success) {
              this.plats = data.data;
            } else {
              console.error('Erreur de récupération des plats par catégorie:', data.message);
            }
          },
          error: (err) => {
            console.error('Erreur serveur:', err);
          }
        });
    }
  }
}
