import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  mensagemErro = '';

  entrar(): void {
    this.mensagemErro = '';

    this.authService.login(this.email, this.senha).subscribe({
      next: (logado) => {
        if (logado) {
          this.router.navigate(['/dashboard']);
        } else {
          this.mensagemErro = 'E-mail ou senha inválidos.';
        }
      },
      error: () => {
        this.mensagemErro = 'Erro ao comunicar com o servidor.';
      }
    });
  }
}
