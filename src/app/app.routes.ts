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
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'dashboard', component: Dashboard, canActivate:[ ] },
  { path: 'personagens', component: Personagens, canActivate:[ ] },
  { path: 'ameacas', component: Ameacas, canActivate:[ ] },
  { path: 'regras', component: Regras, canActivate:[ ] },
  { path: 'habilidades', component: Habilidades, canActivate:[ ] },
  { path: '**', redirectTo: '' }
];
