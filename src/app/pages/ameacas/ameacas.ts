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
    ameaca_id: [0],
    ameaca_nome: ['', Validators.required],
    ameaca_tipo: ['', Validators.required],
    ameaca_nivel: [1, Validators.required],
    ameaca_vida: [1, Validators.required],
    ameaca_descricao: ['']
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.getAll().subscribe(dados => {
      this.ameacas = dados.filter(a => a.ameaca_status !== -1);
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const ameaca: Partial<Ameaca> = {
      ameaca_status: 1,
      ameaca_nome: this.form.value.ameaca_nome!,
      ameaca_tipo: this.form.value.ameaca_tipo!,
      ameaca_nivel: this.form.value.ameaca_nivel!,
      ameaca_vida: this.form.value.ameaca_vida!,
      ameaca_descricao: this.form.value.ameaca_descricao || ''
    };

    if (this.editando) {
      this.service.update(this.form.value.ameaca_id!, ameaca).subscribe(() => {
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
    const status = ameaca.ameaca_status === 1 ? 0 : 1;
    this.service.changeStatus(ameaca.ameaca_id, status).subscribe(() => this.carregar());
  }

  limpar(): void {
    this.editando = false;
    this.form.reset({
      ameaca_id: 0,
      ameaca_nome: '',
      ameaca_tipo: '',
      ameaca_nivel: 1,
      ameaca_vida: 1,
      ameaca_descricao: ''
    });
  }
}
