import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Navbar } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(public router: Router) {}

  get mostrarNavbar(): boolean {

    const paginasComNavbar = [
      '/dashboard',
      '/personagens',
      '/habilidades',
      '/regras',
      '/ameacas'
    ];

    return paginasComNavbar.includes(this.router.url);

  }

}