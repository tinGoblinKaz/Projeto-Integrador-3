import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { RegraService } from '../../core/services/regra.service';
import { Regra } from '../../core/models/regra';

@Component({
  selector: 'app-regras',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './regras.html',
  styleUrl: './regras.css'
})
export class Regras implements OnInit {
  private fb = inject(FormBuilder);
  private regraService = inject(RegraService);

  regras: Regra[] = [];
  editando = false;
  mostrarFormulario = false;

  mensagemSucesso = '';
  mensagemErro = '';

  form = this.fb.group({
    id: [0],
    titulo: ['', Validators.required],
    categoria: ['', Validators.required],
    descricao: ['', Validators.required]
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.regraService.getAll().subscribe({
      next: (dados) => {
        this.regras = dados.filter(r => r.status !== -1);
      },
      error: () => {
        this.mostrarErro('Erro ao carregar regras.');
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.mostrarErro('Preencha os campos obrigatórios.');
      return;
    }

    const regra: Partial<Regra> = {
      status: 1,
      titulo: this.form.value.titulo!,
      categoria: this.form.value.categoria!,
      descricao: this.form.value.descricao!
    };

    if (this.editando) {
      this.regraService.update(this.form.value.id!, regra).subscribe({
        next: () => {
          this.mostrarSucesso('Regra atualizada com sucesso.');
          this.fecharFormulario();
          this.carregar();
        },
        error: () => {
          this.mostrarErro('Erro ao atualizar regra.');
        }
      });
    } else {
      this.regraService.create(regra).subscribe({
        next: () => {
          this.mostrarSucesso('Regra cadastrada com sucesso.');
          this.fecharFormulario();
          this.carregar();
        },
        error: () => {
          this.mostrarErro('Erro ao cadastrar regra.');
        }
      });
    }
  }

  editar(regra: Regra): void {
    this.editando = true;
    this.mostrarFormulario = true;
    this.form.patchValue(regra);
  }

  excluir(id: number): void {
    this.regraService.delete(id).subscribe({
      next: () => {
        this.mostrarSucesso('Regra excluída com sucesso.');
        this.carregar();
      },
      error: () => {
        this.mostrarErro('Erro ao excluir regra.');
      }
    });
  }

  alterarStatus(regra: Regra): void {
    const status = regra.status === 1 ? 0 : 1;

    this.regraService.changeStatus(regra.id, status).subscribe({
      next: () => {
        this.mostrarSucesso('Status alterado com sucesso.');
        this.carregar();
      },
      error: () => {
        this.mostrarErro('Erro ao alterar status.');
      }
    });
  }

  abrirFormulario(): void {
    this.editando = false;
    this.mostrarFormulario = true;

    this.form.reset({
      id: 0,
      titulo: '',
      categoria: '',
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
      titulo: '',
      categoria: '',
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