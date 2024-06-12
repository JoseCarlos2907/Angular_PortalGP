import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadosLibresModel } from '../models/resultadosLibres.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ResultadosLibresService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllResultadosLibresById(idLibre: number): Observable<ResultadosLibresModel[]>{
    return this.#httpClient.get<ResultadosLibresModel[]>(`${environment.urlResultadosLibres}/${idLibre}`);
  }

  getResultadoPilotoByIdLibre(idLibre: number, idPiloto: number): Observable<ResultadosLibresModel>{
    return this.#httpClient.get<ResultadosLibresModel>(`${environment.urlResultadosLibres}/${idLibre}/piloto/${idPiloto}`);
  }

  getTopPilotos(idCarrera: number): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlResultadosLibres}/${idCarrera}/top`);
  }
}
