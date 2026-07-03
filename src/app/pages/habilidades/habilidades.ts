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
    habilidade_id: [0],
    personagem_id: [0, Validators.required],
    habilidade_nome: ['', Validators.required],
    habilidade_tipo: ['', Validators.required],
    habilidade_descricao: ['', Validators.required]
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.getAll().subscribe(dados => {
      this.habilidades = dados.filter(h => h.habilidade_status !== -1);
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const habilidade: Partial<Habilidade> = {
      habilidade_status: 1,
      personagem_id: this.form.value.personagem_id!,
      habilidade_nome: this.form.value.habilidade_nome!,
      habilidade_tipo: this.form.value.habilidade_tipo!,
      habilidade_descricao: this.form.value.habilidade_descricao!
    };

    if (this.editando) {
      this.service.update(this.form.value.habilidade_id!, habilidade).subscribe(() => {
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
    const status = habilidade.habilidade_status === 1 ? 0 : 1;
    this.service.changeStatus(habilidade.habilidade_id, status).subscribe(() => this.carregar());
  }

  limpar(): void {
    this.editando = false;
    this.form.reset({
      habilidade_id: 0,
      personagem_id: 0,
      habilidade_nome: '',
      habilidade_tipo: '',
      habilidade_descricao: ''
    });
  }
}
