import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { Usuario } from '../models/usuario';
import { environment } from './../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService<Usuario> {

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/api/usuarios`);
  }

}
