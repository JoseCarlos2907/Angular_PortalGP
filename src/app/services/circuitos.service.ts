import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CircuitosModel } from '../models/circuitos.model';
import { Observable } from 'rxjs';
import { PaisesModel } from '../models/paises.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CircuitosService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllCircuitos(): Observable<CircuitosModel[]>{
    return this.#httpClient.get<CircuitosModel[]>(`${environment.urlCircuitos}`);
  }

  getCircuitoById(idCircuito: number): Observable<CircuitosModel>{
    return this.#httpClient.get<CircuitosModel>(`${environment.urlCircuitos}/${idCircuito}`);
  }

  getPaisByIdCircuito(idCircuito: number): Observable<PaisesModel>{
    return this.#httpClient.get<PaisesModel>(`${environment.urlCircuitos}/${idCircuito}/pais`);
  }
}
