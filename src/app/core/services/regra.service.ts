import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { Regra } from '../models/regra';
import { environment } from './../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RegraService extends BaseService<Regra> {

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/api/regras`);
  }

}
