import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { Ameaca } from '../models/ameaca';
import { environment } from './../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AmeacaService extends BaseService<Ameaca> {

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/api/ameacas`);
  }

}
