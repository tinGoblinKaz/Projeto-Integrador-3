import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { AmeacaService } from '../../core/services/ameaca.service';
import { Ameaca } from '../../core/models/ameaca';

@Component({
  selector: 'app-ameacas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ameacas.html',
  styleUrl: './ameacas.css'
})
export class Ameacas implements OnInit {
  private fb = inject(FormBuilder);
  private ameacaService = inject(AmeacaService);

  ameacas: Ameaca[] = [];
  editando = false;
  mostrarFormulario = false;

  mensagemSucesso = '';
  mensagemErro = '';

  form = this.fb.group({
    id: [0],
    nome: ['', Validators.required],
    tipo: ['', Validators.required],
    nivel: [1, Validators.required],
    vida: [1, Validators.required],
    descricao: ['']
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.ameacaService.getAll().subscribe({
      next: (dados) => {
        this.ameacas = dados.filter(a => a.status !== -1);
      },
      error: () => {
        this.mostrarErro('Erro ao carregar ameaças.');
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.mostrarErro('Preencha os campos obrigatórios.');
      return;
    }

    const ameaca: Partial<Ameaca> = {
      status: 1,
      nome: this.form.value.nome!,
      tipo: this.form.value.tipo!,
      nivel: this.form.value.nivel!,
      vida: this.form.value.vida!,
      descricao: this.form.value.descricao || ''
    };

    if (this.editando) {
      this.ameacaService.update(this.form.value.id!, ameaca).subscribe({
        next: () => {
          this.mostrarSucesso('Ameaça atualizada com sucesso.');
          this.fecharFormulario();
          this.carregar();
        },
        error: () => {
          this.mostrarErro('Erro ao atualizar ameaça.');
        }
      });
    } else {
      this.ameacaService.create(ameaca).subscribe({
        next: () => {
          this.mostrarSucesso('Ameaça cadastrada com sucesso.');
          this.fecharFormulario();
          this.carregar();
        },
        error: () => {
          this.mostrarErro('Erro ao cadastrar ameaça.');
        }
      });
    }
  }

  editar(ameaca: Ameaca): void {
    this.editando = true;
    this.mostrarFormulario = true;
    this.form.patchValue(ameaca);
  }

  excluir(id: number): void {
    this.ameacaService.delete(id).subscribe({
      next: () => {
        this.mostrarSucesso('Ameaça excluída com sucesso.');
        this.carregar();
      },
      error: () => {
        this.mostrarErro('Erro ao excluir ameaça.');
      }
    });
  }

  alterarStatus(ameaca: Ameaca): void {
    const status = ameaca.status === 1 ? 0 : 1;

    this.ameacaService.changeStatus(ameaca.id, status).subscribe({
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
      nome: '',
      tipo: '',
      nivel: 1,
      vida: 1,
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
      nome: '',
      tipo: '',
      nivel: 1,
      vida: 1,
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