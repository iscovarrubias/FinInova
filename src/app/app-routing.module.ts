import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule),
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./recuperar/recuperar.module').then(m => m.RecuperarPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard], 
  },
  {
    path: 'presupuesto',
    loadChildren: () => import('./presupuesto/presupuesto.module').then(m => m.PresupuestoPageModule),
    canActivate: [AuthGuard], 
  },
  {
    path: 'gastos',
    loadChildren: () => import('./gastos/gastos.module').then(m => m.GastosPageModule),
    canActivate: [AuthGuard], 
  },
  {
    path: '**',
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundPageModule),
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
