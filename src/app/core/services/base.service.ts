import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseService<T> {

  constructor(
    protected http: HttpClient,
    protected apiUrl: string
  ) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(objeto: Partial<T>): Observable<T> {
    return this.http.post<T>(this.apiUrl, objeto);
  }

  update(id: number, objeto: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, objeto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changeStatus(id: number, status: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/status/${status}`,
      {}
    );
  }

}
