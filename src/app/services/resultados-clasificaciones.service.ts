import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadosClasificacionesModel } from '../models/resultadosClasificaciones.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ResultadosClasificacionesService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllResultadosClasificacionById(idClasificacion: number): Observable<ResultadosClasificacionesModel[]>{
    return this.#httpClient.get<ResultadosClasificacionesModel[]>(`${environment.urlResultadosClasificaciones}/${idClasificacion}`);
  }

  getResultadoPilotoByIdClasificacion(idClasificacion: number, idPiloto: number): Observable<ResultadosClasificacionesModel>{
    return this.#httpClient.get<ResultadosClasificacionesModel>(`${environment.urlResultadosClasificaciones}/${idClasificacion}/piloto/${idPiloto}`);
  }

  getTopPilotos(idCarrera: number): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlResultadosClasificaciones}/${idCarrera}/top`);
  }
}
