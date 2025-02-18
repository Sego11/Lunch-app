import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { YourOrderComponent } from './menu/your-order/your-order.component';
import { MenuComponent } from './menu/menu.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainComponent } from './main/main.component';
import { canActivate } from './routeGuards/admin.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', component: MenuComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'admin', component: AdminComponent, canActivate: [canActivate] },
      { path: 'order', component: YourOrderComponent },
      { path: 'menu', component: MenuComponent },
    ],
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
