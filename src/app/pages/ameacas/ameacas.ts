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
  private service = inject(AmeacaService);

  ameacas: Ameaca[] = [];
  editando = false;

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
    this.service.getAll().subscribe(dados => {
      this.ameacas = dados.filter(a => a.status !== -1);
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const ameaca: Partial<Ameaca> = {
      status: 1,
      nome: this.form.value.nome!,
      tipo: this.form.value.tipo!,
      nivel: this.form.value.nivel!,
      vida: this.form.value.vida!,
      descricao: this.form.value.descricao || ''
    };

    if (this.editando) {
      this.service.update(this.form.value.id!, ameaca).subscribe(() => {
        this.limpar();
        this.carregar();
      });
    } else {
      this.service.create(ameaca).subscribe(() => {
        this.limpar();
        this.carregar();
      });
    }
  }

  editar(ameaca: Ameaca): void {
    this.editando = true;
    this.form.patchValue(ameaca);
  }

  excluir(id: number): void {
    this.service.delete(id).subscribe(() => this.carregar());
  }

  alterarStatus(ameaca: Ameaca): void {
    const status = ameaca.status === 1 ? 0 : 1;
    this.service.changeStatus(ameaca.id, status).subscribe(() => this.carregar());
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
}
