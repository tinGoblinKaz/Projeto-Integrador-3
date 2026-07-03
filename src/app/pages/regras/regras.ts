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
    regra_id: [0],
    regra_titulo: ['', Validators.required],
    regra_categoria: ['', Validators.required],
    regra_descricao: ['', Validators.required]
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.getAll().subscribe(dados => {
      this.regras = dados.filter(r => r.regra_status !== -1);
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const regra: Partial<Regra> = {
      regra_status: 1,
      regra_titulo: this.form.value.regra_titulo!,
      regra_categoria: this.form.value.regra_categoria!,
      regra_descricao: this.form.value.regra_descricao!
    };

    if (this.editando) {
      this.service.update(this.form.value.regra_id!, regra).subscribe(() => {
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
    const status = regra.regra_status === 1 ? 0 : 1;
    this.service.changeStatus(regra.regra_id, status).subscribe(() => this.carregar());
  }

  limpar(): void {
    this.editando = false;
    this.form.reset({
      regra_id: 0,
      regra_titulo: '',
      regra_categoria: '',
      regra_descricao: ''
    });
  }
}
