import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css'],
})
export class EmployeComponent implements OnInit {
  employes: any[] = [];
  activeStatut: string = 'ACCEPTE'; // Valeur par défaut

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadEmployes();
  }

  loadEmployes() {
    let url = '';
   if (this.activeStatut === 'ACCEPTE') {
      url = 'http://localhost/miniProjet/employe/getAcceptedEmployes.php';
    } else if (this.activeStatut === 'EN_ATTENTE') {
      url = 'http://localhost/miniProjet/employe/getPendingEmployes.php';
    }

    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.success) {
          this.employes = data.data;
        } else {
          console.error('Erreur lors de la récupération des employés :', data.message);
        }
      },
      error: (err) => {
        console.error('Erreur HTTP :', err);
      }
    });
  }

  filterByStatut(statut: string) {
    this.activeStatut = statut;
    this.loadEmployes();
  }

  editEmploye(emp: any) {
   // this.router.navigate('/admin/employes/editEmploye');
  }

  deleteEmploye(emp: any) {
    // Supprimer l'employé avec une requête DELETE
  }
}
