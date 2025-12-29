import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ServiceDialogComponent } from '../../../components/service-dialog/service-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    RouterLink
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary">
        <span>Admin Dashboard</span>
        <span class="spacer"></span>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <div class="dashboard-content">
        <mat-tab-group>
          <mat-tab label="Informations Entreprise">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Modifier les informations</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="businessForm" (ngSubmit)="updateBusinessInfo()">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Nom de l'auto-école</mat-label>
                      <input matInput formControlName="name">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Adresse</mat-label>
                      <textarea matInput formControlName="address" rows="2"></textarea>
                    </mat-form-field>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Téléphone</mat-label>
                        <input matInput formControlName="phone">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Email</mat-label>
                        <input matInput formControlName="email">
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Description</mat-label>
                      <textarea matInput formControlName="description" rows="4"></textarea>
                    </mat-form-field>

                    <button mat-raised-button color="primary" type="submit" [disabled]="isLoading">
                      {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
                    </button>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
          
          <mat-tab label="Services">
            <div class="tab-content">
              <mat-card>
                <mat-card-header class="services-header">
                  <mat-card-title>Gestion des services</mat-card-title>
                  <button mat-raised-button color="accent" (click)="openServiceDialog()">
                    <mat-icon>add</mat-icon> Ajouter un service
                  </button>
                </mat-card-header>
                <mat-card-content>
                  <table mat-table [dataSource]="services" class="full-width-table">
                    <!-- Icon Column -->
                    <ng-container matColumnDef="icon">
                      <th mat-header-cell *matHeaderCellDef> Icone </th>
                      <td mat-cell *matCellDef="let element"> {{element.icon}} </td>
                    </ng-container>

                    <!-- Name Column -->
                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef> Nom </th>
                      <td mat-cell *matCellDef="let element"> {{element.name}} </td>
                    </ng-container>

                    <!-- Price Column -->
                    <ng-container matColumnDef="price">
                      <th mat-header-cell *matHeaderCellDef> Prix </th>
                      <td mat-cell *matCellDef="let element"> {{element.price}} € </td>
                    </ng-container>

                    <!-- Duration Column -->
                    <ng-container matColumnDef="duration">
                      <th mat-header-cell *matHeaderCellDef> Durée </th>
                      <td mat-cell *matCellDef="let element"> {{element.duration}} </td>
                    </ng-container>

                    <!-- Actions Column -->
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef> Actions </th>
                      <td mat-cell *matCellDef="let element">
                        <button mat-icon-button color="primary" (click)="openServiceDialog(element)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteService(element)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
          <mat-tab label="CMS">
            <div class="tab-content">
              <div class="cms-grid">
                <mat-card class="cms-card">
                  <mat-card-header>
                    <mat-card-title>Pages CMS</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <p>Créer, publier et gérer les pages du site.</p>
                  </mat-card-content>
                  <mat-card-actions>
                    <a mat-raised-button color="primary" routerLink="/admin/pages">Gérer les pages</a>
                  </mat-card-actions>
                </mat-card>

                <mat-card class="cms-card">
                  <mat-card-header>
                    <mat-card-title>Médiathèque</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <p>Uploader et sélectionner des images pour les composants.</p>
                  </mat-card-content>
                  <mat-card-actions>
                    <a mat-raised-button color="primary" routerLink="/admin/media">Ouvrir la médiathèque</a>
                  </mat-card-actions>
                </mat-card>

                <mat-card class="cms-card">
                  <mat-card-header>
                    <mat-card-title>Contenu hérité</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <p>Gérer les sections de contenu existantes.</p>
                  </mat-card-content>
                  <mat-card-actions>
                    <a mat-raised-button color="primary" routerLink="/admin/content">Gérer le contenu</a>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .dashboard-content {
      padding: 20px;
      flex: 1;
      background-color: #F3F4F6;
      overflow-y: auto;
    }
    .tab-content {
      padding: 20px 0;
      max-width: 1000px;
      margin: 0 auto;
    }
    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .services-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .full-width-table {
      width: 100%;
    }
    .cms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .cms-card {
      min-height: 160px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  businessForm: FormGroup;
  services: any[] = [];
  categories: any[] = [];
  isLoading = false;
  displayedColumns: string[] = ['icon', 'name', 'price', 'duration', 'actions'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.businessForm = this.fb.group({
      name: [''],
      address: [''],
      phone: [''],
      email: [''],
      description: ['']
    });
  }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.loadData();
  }

  loadData() {
    this.apiService.getBusinessInfo().subscribe({
      next: (data) => this.businessForm.patchValue(data),
      error: (err) => console.error('Error loading business info:', err)
    });

    this.loadServices();
    this.apiService.getCategories().subscribe(data => this.categories = data);
  }

  loadServices() {
    this.apiService.getServices().subscribe({
      next: (data) => this.services = data,
      error: (err) => console.error('Error loading services:', err)
    });
  }

  updateBusinessInfo() {
    if (this.businessForm.valid) {
      this.isLoading = true;
      this.apiService.updateBusinessInfo(this.businessForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Informations mises à jour !', 'Fermer', { duration: 3000 });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error updating info:', err);
          this.snackBar.open('Erreur lors de la mise à jour.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  openServiceDialog(service?: any) {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      width: '500px',
      data: { service }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (service) {
          // Update
          this.apiService.updateService(service.id, result).subscribe({
            next: () => {
              this.snackBar.open('Service mis à jour', 'Fermer', { duration: 3000 });
              this.loadServices();
            },
            error: () => this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 })
          });
        } else {
          // Create
          this.apiService.createService(result).subscribe({
            next: () => {
              this.snackBar.open('Service créé', 'Fermer', { duration: 3000 });
              this.loadServices();
            },
            error: () => this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 })
          });
        }
      }
    });
  }

  deleteService(service: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${service.name} ?`)) {
      this.apiService.deleteService(service.id).subscribe({
        next: () => {
          this.snackBar.open('Service supprimé', 'Fermer', { duration: 3000 });
          this.loadServices();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/admin/login']);
  }
}
