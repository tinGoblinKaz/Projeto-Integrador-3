import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { PersonagemService } from '../../core/services/personagem.service';
import { Personagem } from '../../core/models/personagem';
import { AuthService } from '../../core/auth/auth.service';
import { HabilidadeService } from '../../core/services/habilidade.service';
import { Habilidade } from '../../core/models/habilidade';

@Component({
  selector: 'app-personagens',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personagens.html',
  styleUrl: './personagens.css'
})
export class Personagens implements OnInit {
  private fb = inject(FormBuilder);
  private personagemService = inject(PersonagemService);
  private authService = inject(AuthService);
  private habilidadeService = inject(HabilidadeService);

  personagens: Personagem[] = [];
  habilidades: Habilidade[] = [];

  editando = false;
  mostrarFormulario = false;

  mensagemSucesso = '';
  mensagemErro = '';

  form = this.fb.group({
    id: [0],
    nome: ['', Validators.required],
    classe: ['', Validators.required],
    nivel: [1, Validators.required],
    pontosVida: [1, Validators.required],
    pontosMana: [0, Validators.required],
    pontosSonho: [0, Validators.required],
    sanidade: [100, Validators.required],
    historia: ['']
  });

  ngOnInit(): void {
    this.carregar();
    this.carregarHabilidades();
  }

  carregar(): void {
    const usuario = this.authService.getUsuarioLogado();

    this.personagemService.getAll().subscribe({
      next: (dados) => {
        this.personagens = dados.filter(p =>
          p.status !== -1 &&
          p.usuarioId === usuario?.id
        );
      },
      error: () => {
        this.mostrarErro('Erro ao carregar personagens.');
      }
    });
  }

  carregarHabilidades(): void {
    this.habilidadeService.getAll().subscribe({
      next: (dados) => {
        this.habilidades = dados.filter(h => h.status !== -1);
      },
      error: () => {
        console.error('Erro ao carregar habilidades.');
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.mostrarErro('Preencha os campos obrigatórios.');
      return;
    }

    const usuario = this.authService.getUsuarioLogado();

    if (!usuario) {
      this.mostrarErro('Usuário não encontrado.');
      return;
    }

    const personagem: Partial<Personagem> = {
      status: 1,
      usuarioId: usuario.id,
      nome: this.form.value.nome!,
      classe: this.form.value.classe!,
      nivel: this.form.value.nivel!,
      pontosVida: this.form.value.pontosVida!,
      pontosMana: this.form.value.pontosMana!,
      pontosSonho: this.form.value.pontosSonho!,
      sanidade: this.form.value.sanidade!,
      historia: this.form.value.historia || ''
    };

    if (this.editando) {
      this.personagemService.update(this.form.value.id!, personagem).subscribe({
        next: () => {
          this.mostrarSucesso('Personagem atualizado com sucesso.');
          this.fecharFormulario();
          this.carregar();
        },
        error: () => {
          this.mostrarErro('Erro ao atualizar personagem.');
        }
      });
    } else {
      this.personagemService.create(personagem).subscribe({
        next: () => {
          this.mostrarSucesso('Personagem cadastrado com sucesso.');
          this.fecharFormulario();
          this.carregar();
        },
        error: () => {
          this.mostrarErro('Erro ao cadastrar personagem.');
        }
      });
    }
  }

  editar(personagem: Personagem): void {
    this.editando = true;
    this.mostrarFormulario = true;
    this.form.patchValue(personagem);
  }

  excluir(id: number): void {
    this.personagemService.delete(id).subscribe({
      next: () => {
        this.mostrarSucesso('Personagem excluído com sucesso.');
        this.carregar();
      },
      error: () => {
        this.mostrarErro('Erro ao excluir personagem.');
      }
    });
  }

  alterarStatus(personagem: Personagem): void {
    const status = personagem.status === 1 ? 0 : 1;

    this.personagemService.changeStatus(personagem.id, status).subscribe({
      next: () => {
        this.mostrarSucesso('Status alterado com sucesso.');
        this.carregar();
      },
      error: () => {
        this.mostrarErro('Erro ao alterar status.');
      }
    });
  }

  habilidadesDoPersonagem(personagemId: number): Habilidade[] {
    return this.habilidades.filter(h => h.personagemId === personagemId);
  }

  abrirFormulario(): void {
    this.editando = false;
    this.mostrarFormulario = true;

    this.form.reset({
      id: 0,
      nome: '',
      classe: '',
      nivel: 1,
      pontosVida: 1,
      pontosMana: 0,
      pontosSonho: 0,
      sanidade: 100,
      historia: ''
    });
  }

  fecharFormulario(): void {
    this.mostrarFormulario = false;
    this.limpar();
  }

  limpar(): void {
    this.editando = false;

    this.form.reset({
      id: 0,
      nome: '',
      classe: '',
      nivel: 1,
      pontosVida: 1,
      pontosMana: 0,
      pontosSonho: 0,
      sanidade: 100,
      historia: ''
    });
  }

  private mostrarSucesso(mensagem: string): void {
    this.mensagemErro = '';
    this.mensagemSucesso = mensagem;

    setTimeout(() => {
      this.mensagemSucesso = '';
    }, 3000);
  }

  private mostrarErro(mensagem: string): void {
    this.mensagemSucesso = '';
    this.mensagemErro = mensagem;

    setTimeout(() => {
      this.mensagemErro = '';
    }, 3000);
  }
}