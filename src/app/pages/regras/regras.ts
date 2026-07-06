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
  private service = inject(RegraService);

  regras: Regra[] = [];
  editando = false;

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
    this.service.getAll().subscribe(dados => {
      this.regras = dados.filter(r => r.status !== -1);
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const regra: Partial<Regra> = {
      status: 1,
      titulo: this.form.value.titulo!,
      categoria: this.form.value.categoria!,
      descricao: this.form.value.descricao!
    };

    if (this.editando) {
      this.service.update(this.form.value.id!, regra).subscribe(() => {
        this.limpar();
        this.carregar();
      });
    } else {
      this.service.create(regra).subscribe(() => {
        this.limpar();
        this.carregar();
      });
    }
  }

  editar(regra: Regra): void {
    this.editando = true;
    this.form.patchValue(regra);
  }

  excluir(id: number): void {
    this.service.delete(id).subscribe(() => this.carregar());
  }

  alterarStatus(regra: Regra): void {
    const status = regra.status === 1 ? 0 : 1;
    this.service.changeStatus(regra.id, status).subscribe(() => this.carregar());
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
}
