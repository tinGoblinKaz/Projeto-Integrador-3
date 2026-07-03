import { environment } from './../../../enviroments/enviroment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { Personagem } from '../models/personagem';


@Injectable({
  providedIn: 'root'
})
export class PersonagemService extends BaseService<Personagem> {

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/api/personagens`);
  }

}
