import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plat',
  templateUrl: './plat.component.html',
  styleUrls: ['./plat.component.css'],
})
export class PlatComponent implements OnInit {
  plats: any[] = [];
  plat: any;
  activeCategorie: string = 'TOUT'; // Par défaut "TOUT" est actif

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.filterByCategorie('TOUT'); // ⚡ Appelle directement pour afficher tous les plats au début
  }

  // Edit the Plat (dish)
  editPlat(plat: any) {
    console.log('Edit:', plat);
    this.router.navigate(['/admin/plats/editPlat', plat.idPlat]);
  }

  // Delete the Plat (dish)
  deletePlat(plat: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.http.delete(`http://localhost/miniProjet/menu/deleteMenu.php?idPlat=${plat.idPlat}`)
        .subscribe({
          next: (data: any) => {
            if (data.success) {
              console.log('Item deleted successfully');
              this.refreshData();
            } else {
              console.error('Error deleting item:', data.message);
            }
          },
          error: (err) => {
            console.error('Error deleting item:', err);
          }
        });
    }
  }

  // Refresh the data by calling the API again
  refreshData() {
    this.http.get('http://localhost/miniProjet/menu/readAllMenu.php').subscribe({
      next: (response: any) => {
        this.plats = response.data;
      },
      error: (error) => {
        console.error('Error loading plats:', error);
      }
    });
  }

  // Filter dishes by category
  filterByCategorie(categorie: string) {
    this.activeCategorie = categorie; // 🔥 Set active category

    if (categorie === 'TOUT') {
      this.http.get<any>('http://localhost/miniProjet/menu/readAllMenu.php')
        .subscribe({
          next: (data) => {
            if (data.success) {
              this.plats = data.data;
            } else {
              console.error('Error fetching all dishes:', data.message);
            }
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des plats', err);
          }
        });
    } else {
      this.http.get<any>(`http://localhost/miniProjet/menu/readMenuByCategorie.php?categorie=${categorie}`)
        .subscribe({
          next: (data) => {
            if (data.success) {
              this.plats = data.data;
            } else {
              console.error('Error fetching dishes by category:', data.message);
            }
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des plats par catégorie', err);
          }
        });
    }
  }
}
