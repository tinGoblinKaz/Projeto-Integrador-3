import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { Habilidade } from '../models/habilidade';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HabilidadeService extends BaseService<Habilidade> {

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/api/habilidades`);
  }

}
