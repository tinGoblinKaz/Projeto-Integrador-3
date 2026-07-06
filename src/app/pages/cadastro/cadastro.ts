import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/auth/auth.service';
import { Usuario } from '../../core/models/usuario';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {

  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  mensagemErro = '';

  cadastroForm = this.fb.nonNullable.group({

    nome: [
      '',
      Validators.required
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    senha: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],

    confirmarSenha: [
      '',
      Validators.required
    ],

    usuario_imagem: ['']

  });

  cadastrar(): void {

    this.mensagemErro = '';

    if (this.cadastroForm.invalid) {

      this.cadastroForm.markAllAsTouched();

      this.mensagemErro =
        'Preencha todos os campos obrigatórios corretamente.';

      return;
    }

    const dados = this.cadastroForm.getRawValue();

    if (dados.senha !== dados.confirmarSenha) {

      this.mensagemErro = 'As senhas não coincidem.';

      return;
    }

    const novoUsuario: Partial<Usuario> = {

      status: 1,

      nome: dados.nome,

      email: dados.email,

      senha: dados.senha,


    };

    this.usuarioService.create(novoUsuario).subscribe({

      next: (usuarioCriado) => {

        if (usuarioCriado?.id) {

          this.authService.setUsuarioLogado(usuarioCriado);

          this.router.navigate(['/dashboard']);

          return;

        }

        this.fazerLoginAutomatico(
          dados.email,
          dados.senha
        );

      },

      error: () => {

        this.mensagemErro = 'Erro ao cadastrar usuário.';

      }

    });

  }

  private fazerLoginAutomatico(
    email: string,
    senha: string
  ): void {

    this.authService.login(email, senha).subscribe({

      next: (logado) => {

        this.router.navigate([
          logado ? '/dashboard' : '/login'
        ]);

      },

      error: () => {

        this.router.navigate(['/login']);

      }

    });

  }

}