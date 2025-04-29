import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detailsplats',
  templateUrl: './detailsplats.component.html',
  styleUrls: ['./detailsplats.component.css']
})
export class DetailsplatsComponent implements OnInit {

  idPlat!: number;
  plat: any; // Les détails du plat
  ingredients: { idIngredient: number, nomIngredient: string }[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idPlat');
      if (id) {
        this.idPlat = +id;
        this.getPlatById(this.idPlat);
        this.getIngredientsByPlat(this.idPlat);
      }
    });
  }

  getPlatById(idPlat: number) {
    this.http.get<any>(`http://localhost/miniProjet/menu/getPlatById.php?idPlat=${idPlat}`)
      .subscribe({
        next: (data) => {
          if (data.success) {
            this.plat = data.data;
          } else if (data.name) {
            this.plat = data;
          } else {
            console.error('Erreur lors de la récupération du plat:', data.message);
          }
        },
        error: (err) => {
          console.error('Erreur serveur (plat):', err);
        }
      });
  }

  getIngredientsByPlat(idPlat: number) {
    this.http.get<any>('http://localhost/miniProjet/ingredient/readIngrediantParPlat.php?idPlat='+idPlat)
  .subscribe({
    next: (data) => {console.log('Ingrédients:', data)
    if (data && Array.isArray(data)) {
      this.ingredients = data;
    }},
    error: (err) => console.error('Erreur:', err)
  });

  }
}
