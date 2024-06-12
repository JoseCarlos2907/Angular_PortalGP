import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ResultadosCarrerasModel } from '../models/resultadosCarreras.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ResultadosCarrerasService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllResultadosCarreraById(idCarrera: number): Observable<ResultadosCarrerasModel[]>{
    return this.#httpClient.get<ResultadosCarrerasModel[]>(`${environment.urlResultadosCarreras}/${idCarrera}`);
  }

  getResultadoPilotoByIdCarrera(idCarrera: number, idPiloto: number): Observable<ResultadosCarrerasModel>{
    return this.#httpClient.get<ResultadosCarrerasModel>(`${environment.urlResultadosCarreras}/${idCarrera}/piloto/${idPiloto}`);
  }

  getTopPilotos(idCarrera: number): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlResultadosCarreras}/${idCarrera}/top`);
  }
}
