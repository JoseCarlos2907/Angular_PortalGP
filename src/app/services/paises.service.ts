import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PaisesModel } from '../models/paises.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllPaises(): Observable<PaisesModel[]>{
    return this.#httpClient.get<PaisesModel[]>(`${environment.urlPaises}`);
  }

  getPaisById(idPais: number): Observable<PaisesModel>{
    return this.#httpClient.get<PaisesModel>(`${environment.urlPaises}/${idPais}`);
  }
}
