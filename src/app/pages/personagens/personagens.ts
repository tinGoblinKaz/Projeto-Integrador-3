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
    personagem_id: [0],
    personagem_nome: ['', Validators.required],
    personagem_classe: ['', Validators.required],
    personagem_nivel: [1, Validators.required],
    personagem_pontos_vida: [1, Validators.required],
    personagem_pontos_mana: [0, Validators.required],
    personagem_pontos_sonho: [0, Validators.required],
    personagem_sanidade: [100, Validators.required],
    personagem_historia: ['']
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    const usuario = this.authService.getUsuarioLogado();

    this.personagemService.getAll().subscribe({
      next: (dados) => {
        this.personagens = dados.filter(p =>
          p.personagem_status !== -1 &&
          p.usuario_id === usuario?.usuario_id
        );
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const usuario = this.authService.getUsuarioLogado();

    const personagem: Partial<Personagem> = {
      personagem_status: 1,
      usuario_id: usuario?.usuario_id,
      personagem_nome: this.form.value.personagem_nome!,
      personagem_classe: this.form.value.personagem_classe!,
      personagem_nivel: this.form.value.personagem_nivel!,
      personagem_pontos_vida: this.form.value.personagem_pontos_vida!,
      personagem_pontos_mana: this.form.value.personagem_pontos_mana!,
      personagem_pontos_sonho: this.form.value.personagem_pontos_sonho!,
      personagem_sanidade: this.form.value.personagem_sanidade!,
      personagem_historia: this.form.value.personagem_historia || ''
    };

    if (this.editando) {
      this.personagemService.update(this.form.value.personagem_id!, personagem).subscribe(() => {
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
    const novoStatus = personagem.personagem_status === 1 ? 0 : 1;

    this.personagemService.changeStatus(personagem.personagem_id, novoStatus)
      .subscribe(() => this.carregar());
  }

  limpar(): void {
    this.editando = false;
    this.form.reset({
      personagem_id: 0,
      personagem_nome: '',
      personagem_classe: '',
      personagem_nivel: 1,
      personagem_pontos_vida: 1,
      personagem_pontos_mana: 0,
      personagem_pontos_sonho: 0,
      personagem_sanidade: 100,
      personagem_historia: ''
    });
  }
}
