import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { HabilidadeService } from '../../core/services/habilidade.service';
import { Habilidade } from '../../core/models/habilidade';
import { PersonagemService } from '../../core/services/personagem.service';
import { Personagem } from '../../core/models/personagem';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-habilidades',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './habilidades.html',
  styleUrl: './habilidades.css'
})
export class Habilidades implements OnInit {
  private fb = inject(FormBuilder);
  private habilidadeService = inject(HabilidadeService);
  private personagemService = inject(PersonagemService);
  private authService = inject(AuthService);

  habilidades: Habilidade[] = [];
  personagens: Personagem[] = [];

  editando = false;
  mostrarFormulario = false;

  mensagemSucesso = '';
  mensagemErro = '';

  form = this.fb.group({
    id: [0],
    personagemId: [0, Validators.required],
    nome: ['', Validators.required],
    tipo: ['', Validators.required],
    descricao: ['', Validators.required]
  });

  ngOnInit(): void {
    this.carregarPersonagens();
  }

  carregarPersonagens(): void {
    const usuario = this.authService.getUsuarioLogado();

    this.personagemService.getAll().subscribe({
      next: (dados) => {
        this.personagens = dados.filter(p =>
          p.status !== -1 &&
          p.usuarioId === usuario?.id
        );

        this.carregar();
      },
      error: () => {
        this.mostrarErro('Erro ao carregar personagens.');
      }
    });
  }

  carregar(): void {
    this.habilidadeService.getAll().subscribe({
      next: (dados) => {
        const idsPersonagens = this.personagens.map(p => p.id);

        this.habilidades = dados.filter(h =>
          h.status !== -1 &&
          idsPersonagens.includes(h.personagemId)
        );
      },
      error: () => {
        this.mostrarErro('Erro ao carregar habilidades.');
      }
    });
  }

  salvar(): void {
    if (this.form.invalid || this.form.value.personagemId === 0) {
      this.mostrarErro('Preencha todos os campos e selecione um personagem.');
      return;
    }

    const habilidade: Partial<Habilidade> = {
      status: 1,
      personagemId: this.form.value.personagemId!,
      nome: this.form.value.nome!,
      tipo: this.form.value.tipo!,
      descricao: this.form.value.descricao!
    };

    if (this.editando) {
      this.habilidadeService.update(this.form.value.id!, habilidade).subscribe({
        next: () => {
          this.mostrarSucesso('Habilidade atualizada com sucesso.');
          this.fecharFormulario();
          this.carregar();
        },
        error: () => {
          this.mostrarErro('Erro ao atualizar habilidade.');
        }
      });
    } else {
      this.habilidadeService.create(habilidade).subscribe({
        next: () => {
          this.mostrarSucesso('Habilidade cadastrada com sucesso.');
          this.fecharFormulario();
          this.carregar();
        },
        error: () => {
          this.mostrarErro('Erro ao cadastrar habilidade.');
        }
      });
    }
  }

  editar(habilidade: Habilidade): void {
    this.editando = true;
    this.mostrarFormulario = true;
    this.form.patchValue(habilidade);
  }

  excluir(id: number): void {
    this.habilidadeService.delete(id).subscribe({
      next: () => {
        this.mostrarSucesso('Habilidade excluída com sucesso.');
        this.carregar();
      },
      error: () => {
        this.mostrarErro('Erro ao excluir habilidade.');
      }
    });
  }

  alterarStatus(habilidade: Habilidade): void {
    const status = habilidade.status === 1 ? 0 : 1;

    this.habilidadeService.changeStatus(habilidade.id, status).subscribe({
      next: () => {
        this.mostrarSucesso('Status alterado com sucesso.');
        this.carregar();
      },
      error: () => {
        this.mostrarErro('Erro ao alterar status.');
      }
    });
  }

  nomePersonagem(personagemId: number): string {
    const personagem = this.personagens.find(p => p.id === personagemId);
    return personagem ? personagem.nome : `ID ${personagemId}`;
  }

  abrirFormulario(): void {
    this.editando = false;
    this.mostrarFormulario = true;

    this.form.reset({
      id: 0,
      personagemId: 0,
      nome: '',
      tipo: '',
      descricao: ''
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
      personagemId: 0,
      nome: '',
      tipo: '',
      descricao: ''
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