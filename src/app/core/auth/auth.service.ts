import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  private readonly storageKey = 'usuarioLogado';

  login(email: string, senha: string): Observable<boolean> {
    return this.usuarioService.getAll().pipe(
      map((usuarios) => {
        const usuarioEncontrado = usuarios.find((usuario) =>
          usuario.email === email &&
          usuario.senha === senha &&
          usuario.status === 1
        );

        if (usuarioEncontrado) {
          this.setUsuarioLogado(usuarioEncontrado);
          return true;
        }

        return false;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getUsuarioLogado();
  }

  getUsuarioLogado(): Usuario | null {
    const usuario = localStorage.getItem(this.storageKey);

    if (!usuario) {
      return null;
    }

    return JSON.parse(usuario) as Usuario;
  }

  setUsuarioLogado(usuario: Usuario): void {
    localStorage.setItem(this.storageKey, JSON.stringify(usuario));
  }
}
