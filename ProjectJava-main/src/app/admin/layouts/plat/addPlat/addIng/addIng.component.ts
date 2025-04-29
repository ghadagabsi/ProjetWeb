import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-ing',
  templateUrl: './addIng.component.html',
  styleUrls: ['./addIng.component.css']
})
export class AddIngComponent {
  formData = {
    nom: '',
  };
  platId: string | null = null;

  // Ingredients now store id + nom
  ingredients: { idIngredient: number, nomIngredient: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.platId = this.route.snapshot.paramMap.get('id');
    if (this.platId) {
      this.fetchIngredients();
    }
  }

  deleteIngredient(idIngredient: number): void {
    if (!this.platId) return;

    const url = `http://localhost/miniProjet/ingredient/deleteIng.php?idPlat=${this.platId}&idIngredient=${idIngredient}`;

    this.http.delete(url).subscribe(
      () => {
        this.ingredients = this.ingredients.filter(item => item.idIngredient !== idIngredient);
        this.showAlert('Ingredient deleted successfully!', 'success');
      },
      (error) => {
        console.error('Error deleting ingredient:', error);
        this.showAlert('Failed to delete ingredient.', 'error');
      }
    );
  }

  onSubmit(): void {
    if (!this.platId) {
      this.showAlert('Invalid dish ID.', 'error');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('nomIngredient', this.formData.nom);
    formDataToSend.append('idPlat', this.platId);

    this.http.post('http://localhost/miniProjet/ingredient/addIngrd.php', formDataToSend).subscribe(
      (response: any) => {
        this.showAlert('Ingredient added successfully!', 'success');
        this.resetForm();
        this.fetchIngredients(); // Refresh the list
      },
      (error) => {
        let errorMessage = 'An unexpected error occurred';
        if (error.status === 400) errorMessage = 'Ingredient already exists.';
        else if (error.status === 401) errorMessage = 'Unauthorized access.';
        else if (error.status === 500) errorMessage = 'Server error.';
        this.showAlert(errorMessage, 'error');
      }
    );
  }

  exite(): void {
    this.showAlert('Dish added successfully!', 'success');
    this.router.navigate(['/admin/plats']);
  }

  fetchIngredients(): void {
    if (!this.platId) return;

    const formData = new FormData();
    formData.append('idPlat', this.platId);

    this.http.post<any[]>('http://localhost/miniProjet/ingredient/readIngrediantParPlat.php', formData)
      .subscribe(
        (ingredients) => {
          // Expecting array with id and nom
          this.ingredients = ingredients.map(ing => ({
            idIngredient: ing.idIngredient,
            nomIngredient: ing.nomIngredient || ing.nom || ing.name
          }));
        },
        (error) => {
          console.error('Error fetching ingredients:', error);
        }
      );
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
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

  private resetForm(): void {
    this.formData.nom = '';
  }
}
