import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/admin/Services/auth.service';

@Component({
  selector: 'app-editPlat',
  templateUrl: './editPlat.component.html',
  styleUrls: ['./editPlat.component.css']
})
export class EditPlatComponent implements OnInit {
  formData: any = {
    nom: '',
    prix: 0,
    categorie: '',
    description: '',
    image: null
  };
  imagePreview: string | ArrayBuffer | null = null;
  platId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

    ngOnInit(): void {
      this.platId = this.route.snapshot.paramMap.get('idPlat');

      if (this.platId) {
        this.http.get(`http://localhost/miniProjet/menu/getPlatById.php?idPlat=${this.platId}`, { headers: this.getHeaders() })
          .subscribe({
            next: (plat: any) => {
              console.log('Plat chargé:', plat);

              // ✅ Ne pas remplacer formData complètement
              this.formData.nom = plat.nom;
              this.formData.prix = plat.prix;
              this.formData.categorie = plat.categorie;
              this.formData.description = plat.description;

              if (plat.image) {
                this.imagePreview = plat.image; // adapte ici selon si c'est une URL ou base64
              }
            },
            error: (err) => {
              console.error('Erreur lors du chargement du plat', err);
            }
          });
      }
    }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.formData.image = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.platId) return;

    const formPayload = new FormData();
    formPayload.append('nom', this.formData.nom);
    formPayload.append('prix', this.formData.prix.toString());
    formPayload.append('categorie', this.formData.categorie);
    formPayload.append('description', this.formData.description);
    if (this.formData.image) {
      formPayload.append('image', this.formData.image);
    }

    this.http.put(`http://localhost/miniProjet/menu/editMenu.php?idPlat=${this.platId}`, formPayload, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          alert('Plat mis à jour avec succès!');
          this.router.navigate(['/admin/plats']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
        }
      });
  }
}
