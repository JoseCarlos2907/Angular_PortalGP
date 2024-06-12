import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CarrerasModel } from '../models/carreras.model';
import { ComentariosModel } from '../models/comentarios.model';
import { LibresModel } from '../models/libres.model';
import { ClasificacionesModel } from '../models/clasificaciones.model';
import { CircuitosModel } from '../models/circuitos.model';
import { environment } from '../../environments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class CarrerasService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllCarreras(): Observable<CarrerasModel[]>{
    return this.#httpClient.get<CarrerasModel[]>(`${environment.urlCarreras}`);
  }

  getCarreraById(idCarrera: number): Observable<CarrerasModel>{
    return this.#httpClient.get<CarrerasModel>(`${environment.urlCarreras}/carrera/${idCarrera}`);
  }

  getComentariosCarreraByIdCarrera(idCarrera: number): Observable<ComentariosModel[]>{
    return this.#httpClient.get<ComentariosModel[]>(`${environment.urlCarreras}/${idCarrera}/comentarios`);
  }

  getLibresByIdCarrera(idCarrera: number): Observable<LibresModel[]>{
    return this.#httpClient.get<LibresModel[]>(`${environment.urlCarreras}/${idCarrera}/libres`);
  }

  getClasficacionByIdCarrera(idCarrera: number): Observable<ClasificacionesModel>{
    return this.#httpClient.get<ClasificacionesModel>(`${environment.urlCarreras}/${idCarrera}/clasificacion`);
  }

  getCircuitoByIdCarrera(idCarrera: number): Observable<CircuitosModel>{
    return this.#httpClient.get<CircuitosModel>(`${environment.urlCarreras}/${idCarrera}/circuito`);
  }

  getAllFechas(): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlCarreras}/fechas`);
  }

  getListaCarreras(): Promise<any>{
    return this.#httpClient.get<any>(`${environment.urlCarreras}/lista-carreras`).toPromise();
  }

  // Metodos POST
  comentarEnCarrera(idCarrera: number, data: any): Observable<any>{
    return this.#httpClient.post<any>(`${environment.urlCarreras}/${idCarrera}/comentar`, data);
  }
}
