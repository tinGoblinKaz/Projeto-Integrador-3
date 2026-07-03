import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/auth/auth.service';
import { Usuario } from '../../core/models/usuario';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);

  mensagemErro = '';

  cadastroForm = this.fb.group({
    usuario_nome: ['', Validators.required],
    usuario_email: ['', [Validators.required, Validators.email]],
    usuario_senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', Validators.required],
    usuario_imagem: ['']
  });

  cadastrar(): void {
    this.mensagemErro = '';

    if (this.cadastroForm.invalid) {
      this.mensagemErro = 'Preencha todos os campos obrigatórios corretamente.';
      return;
    }

    const dados = this.cadastroForm.value;

    if (dados.usuario_senha !== dados.confirmarSenha) {
      this.mensagemErro = 'As senhas não coincidem.';
      return;
    }

    const novoUsuario: Partial<Usuario> = {
      usuario_status: 1,
      usuario_nome: dados.usuario_nome!,
      usuario_email: dados.usuario_email!,
      usuario_senha: dados.usuario_senha!,
      usuario_imagem: dados.usuario_imagem || ''
    };

    this.usuarioService.create(novoUsuario).subscribe({
      next: (usuarioCriado) => {
        if (usuarioCriado?.usuario_id) {
          this.authService.setUsuarioLogado(usuarioCriado);
          this.router.navigate(['/dashboard']);
        } else {
          this.fazerLoginAutomatico(novoUsuario.usuario_email!, novoUsuario.usuario_senha!);
        }
      },
      error: () => {
        this.mensagemErro = 'Erro ao cadastrar usuário.';
      }
    });
  }

  private fazerLoginAutomatico(email: string, senha: string): void {
    this.authService.login(email, senha).subscribe({
      next: (logado) => {
        if (logado) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
