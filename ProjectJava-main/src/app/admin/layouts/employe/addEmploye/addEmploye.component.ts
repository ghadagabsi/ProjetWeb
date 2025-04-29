import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/admin/Services/auth.service';

@Component({
  selector: 'app-add-employe',
  templateUrl: './addEmploye.component.html',
  styleUrls: ['./addEmploye.component.css']
})
export class AddEmployeComponent {
  formData = {
    nom_complet: '',
    email: '',
    mot_de_passe: '',
    role: 'serveur',
    statut: 'accepte' // always set to "accepte"
  };

  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.selectedImage) {
      this.showAlert('Please select an image.', 'error');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('nom_complet', this.formData.nom_complet);
    formDataToSend.append('email', this.formData.email);
    formDataToSend.append('mot_de_passe', this.formData.mot_de_passe);
    formDataToSend.append('role', this.formData.role);
    formDataToSend.append('statut', 'accepte'); // enforce "accepte" regardless of form value
    formDataToSend.append('image', this.selectedImage);

    this.http.post('http://localhost/miniProjet/employe/addEmploye.php', formDataToSend).subscribe(
      (response: any) => {
        console.log('Success:', response);
        this.showAlert('Employé ajouté avec succès !', 'success');
        this.resetForm();
        this.router.navigate(['/admin/employes']);
      },
      (error) => {
        console.error('Error:', error);
        let errorMessage = 'Une erreur est survenue.';
        if (error.status === 400) {
          errorMessage = 'Veuillez vérifier les champs.';
        } else if (error.status === 401) {
          errorMessage = 'Accès non autorisé.';
        } else if (error.status === 500) {
          errorMessage = 'Erreur du serveur.';
        }
        this.showAlert(errorMessage, 'error');
      }
    );
  }

  private showAlert(message: string, type: 'success' | 'error') {
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '20px';
    alertBox.style.right = '20px';
    alertBox.style.padding = '15px 25px';
    alertBox.style.background = type === 'success' ? '#e8f5e9' : '#ffebee';
    alertBox.style.color = type === 'success' ? '#2e7d32' : '#c62828';
    alertBox.style.borderLeft = `4px solid ${type === 'success' ? '#2e7d32' : '#c62828'}`;
    alertBox.style.borderRadius = '4px';
    alertBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    alertBox.style.zIndex = '1000';
    alertBox.style.display = 'flex';
    alertBox.style.alignItems = 'center';
    alertBox.style.gap = '10px';
    alertBox.innerHTML = `
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="${
          type === 'success'
            ? 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z'
            : 'M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16'
        }"/>
      </svg>
      <span>${message}</span>
    `;

    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.style.opacity = '0';
      alertBox.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        document.body.removeChild(alertBox);
      }, 500);
    }, 3000);
  }

  private resetForm() {
    this.formData = {
      nom_complet: '',
      email: '',
      mot_de_passe: '',
      role: 'serveur',
      statut: 'accepte'
    };
    this.selectedImage = null;
    this.imagePreview = null;
  }
}
