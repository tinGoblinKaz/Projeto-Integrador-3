import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { PersonagemService } from '../../core/services/personagem.service';
import { AuthService } from '../../core/auth/auth.service';
import { Personagem } from '../../core/models/personagem';

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

  personagens: Personagem[] = [];
  editando = false;

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
  }

  carregar(): void {
    const usuario = this.authService.getUsuarioLogado();

    this.personagemService.getAll().subscribe({
      next: (dados) => {
        this.personagens = dados.filter(p =>
          p.status !== -1 &&
          p.id === usuario?.id
        );
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const usuario = this.authService.getUsuarioLogado();

    const personagem: Partial<Personagem> = {
      status: 1,
      usuarioId: usuario!.id,
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
      this.personagemService.update(this.form.value.id!, personagem).subscribe(() => {
        this.limpar();
        this.carregar();
      });
    } else {
      this.personagemService.create(personagem).subscribe(() => {
        this.limpar();
        this.carregar();
      });
    }
  }

  editar(personagem: Personagem): void {
    this.editando = true;
    this.form.patchValue(personagem);
  }

  excluir(id: number): void {
    this.personagemService.delete(id).subscribe(() => this.carregar());
  }

  alterarStatus(personagem: Personagem): void {
    const novoStatus = personagem.status === 1 ? 0 : 1;

    this.personagemService.changeStatus(personagem.id, novoStatus)
      .subscribe(() => this.carregar());
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
}
