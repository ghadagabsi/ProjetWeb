import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HeaderComponent } from './layouts/header/header.component';
import { ListeEmployesComponent } from './layouts/liste-employes/liste-employes.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TableRestaurantComponent } from './layouts/table-restaurant/table-restaurant.component';
import { EditPlatComponent } from './layouts/plat/editPlat/editPlat.component';
import { PlatComponent } from './layouts/plat/plat.component';
import { EmployeComponent } from './layouts/employe/employe.component';
import { AddPlatComponent } from './layouts/plat/addPlat/addPlat.component';
import { AddIngComponent } from './layouts/plat/addPlat/addIng/addIng.component';
import { AddEmployeComponent } from './layouts/employe/addEmploye/addEmploye.component';
import { EditEmployeComponent } from './layouts/employe/editEmploye/editEmploye.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    HeaderComponent,
    ListeEmployesComponent,
    LoginComponent,
    RegisterComponent,
    TableRestaurantComponent,
    PlatComponent,
    AddPlatComponent,
    AddIngComponent,
    EditPlatComponent,
    EmployeComponent,
    AddEmployeComponent,
    EditEmployeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AdminModule { }
