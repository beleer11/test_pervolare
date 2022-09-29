import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { ProductComponent } from './product/product.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ListComponent } from './list/list.component';
import { AttributesComponent } from './attributes/attributes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AttributesModalComponent } from './attributes/modal-attribute/modal-attributes.component';
import { ProductModalComponent } from './list/modal-product/modal-product.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, 
    canActivate: [ AuthGuardService ]
  }
];

@NgModule({
  declarations: [
    ProductComponent,
    HomeComponent,
    ListComponent,
    AttributesComponent,
    AttributesModalComponent,
    ProductModalComponent
  ], 
  imports: [
    CommonModule,
    MatTabsModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class HomeModule { }
