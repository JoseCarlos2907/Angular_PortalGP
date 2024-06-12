import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class BuscarService {

  #httpClient: HttpClient = inject(HttpClient);

  getBusqueda(cadena: string): Observable<any>{
    if(cadena.length == 0){
      return this.#httpClient.post<any>(`${environment.url}/buscar/`, `{"cadena": "a"}`);
    }

    return this.#httpClient.post<any>(`${environment.url}/buscar/`, `{"cadena": "${cadena}"}`);
  }
}
