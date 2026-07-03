import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Dashboard } from './pages/dashboard/dashboard';
import { Personagens } from './pages/personagens/personagens';
import { Ameacas } from './pages/ameacas/ameacas';
import { Regras } from './pages/regras/regras';
import { Habilidades } from './pages/habilidades/habilidades';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'dashboard', component: Dashboard, canActivate:[authGuard ] },
  { path: 'personagens', component: Personagens, canActivate:[authGuard ] },
  { path: 'ameacas', component: Ameacas, canActivate:[authGuard ] },
  { path: 'regras', component: Regras, canActivate:[authGuard ] },
  { path: 'habilidades', component: Habilidades, canActivate:[authGuard ] },
  { path: '**', redirectTo: '' }
];
