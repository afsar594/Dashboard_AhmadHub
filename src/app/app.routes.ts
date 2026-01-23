import { Routes } from '@angular/router';
import { AdminAddProductComponent } from './component/admin-add-product/admin-add-product.component';
import { AdminLoginComponent } from './component/admin-login/admin-login.component';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: AdminLoginComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'adminproductmanagement', component: AdminAddProductComponent },
];
