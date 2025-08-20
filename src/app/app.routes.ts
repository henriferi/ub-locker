import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.ROUTES)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'historico-modal',
    loadComponent: () => import('./aluno/modals/historico-modal/historico-modal.page').then( m => m.HistoricoModalPage)
  },
  {
    path: 'logout-confirm-modal',
    loadComponent: () => import('./aluno/modals/logout-confirm-modal/logout-confirm-modal.page').then( m => m.LogoutConfirmModalPage)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./registrar/registrar.page').then( m => m.RegistrarPage)
  },
  {
    path: 'sobre',
    loadComponent: () => import('./funcionario/sobre/sobre.page').then( m => m.SobrePage)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./registrar/registrar.page').then( m => m.RegistrarPage)
  },
  {
    path: 'desvincular-modal',
    loadComponent: () => import('./funcionario/modals/desvincular-modal/desvincular-modal.page').then( m => m.DesvincularModalPage)
  },
  {
    path: 'desvincular',
    loadComponent: () => import('./funcionario/desvincular/desvincular.page').then( m => m.DesvincularPage)
  },
  {
    path: 'alterar-senha-modal',
    loadComponent: () => import('./components/alterar-senha-modal/alterar-senha-modal.page').then( m => m.AlterarSenhaModalPage)
  },
  {
    path: 'verificar-aluno-modal',
    loadComponent: () => import('./funcionario/modals/verificar-aluno-modal/verificar-aluno-modal.page').then( m => m.verificarAlunoModalPage)
  },
];

export const AppRoutes = provideRouter(routes);
