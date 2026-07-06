import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HabilidadeService } from '../../core/services/habilidade.service';
import { Habilidade } from '../../core/models/habilidade';

@Component({
  selector: 'app-habilidades',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './habilidades.html',
  styleUrl: './habilidades.css'
})
export class Habilidades implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(HabilidadeService);

  habilidades: Habilidade[] = [];
  editando = false;

  form = this.fb.group({
    id: [0],
    personagemId: [0, Validators.required],
    nome: ['', Validators.required],
    tipo: ['', Validators.required],
    descricao: ['', Validators.required]
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.getAll().subscribe(dados => {
      this.habilidades = dados.filter(h => h.status !== -1);
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const habilidade: Partial<Habilidade> = {
      status: 1,
      personagemId: this.form.value.personagemId!,
      nome: this.form.value.nome!,
      tipo: this.form.value.tipo!,
      descricao: this.form.value.descricao!
    };

    if (this.editando) {
      this.service.update(this.form.value.id!, habilidade).subscribe(() => {
        this.limpar();
        this.carregar();
      });
    } else {
      this.service.create(habilidade).subscribe(() => {
        this.limpar();
        this.carregar();
      });
    }
  }

  editar(habilidade: Habilidade): void {
    this.editando = true;
    this.form.patchValue(habilidade);
  }

  excluir(id: number): void {
    this.service.delete(id).subscribe(() => this.carregar());
  }

  alterarStatus(habilidade: Habilidade): void {
    const status = habilidade.status === 1 ? 0 : 1;
    this.service.changeStatus(habilidade.id, status).subscribe(() => this.carregar());
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
}
