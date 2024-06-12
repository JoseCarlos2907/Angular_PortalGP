import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClasificacionesModel } from '../models/clasificaciones.model';
import { CarrerasModel } from '../models/carreras.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionesService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllClasificaciones(): Observable<ClasificacionesModel[]>{
    return this.#httpClient.get<ClasificacionesModel[]>(`${environment.urlClasificaciones}`);
  }

  getClasificacionById(idClasificacion: number): Observable<ClasificacionesModel>{
    return this.#httpClient.get<ClasificacionesModel>(`${environment.urlClasificaciones}/${idClasificacion}`);
  }

  getCarreraById(idClasificacion: number): Observable<CarrerasModel>{
    return this.#httpClient.get<CarrerasModel>(`${environment.urlClasificaciones}/${idClasificacion}/carrera`);
  }
}
