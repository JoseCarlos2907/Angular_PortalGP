import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LibresModel } from '../models/libres.model';
import { Observable } from 'rxjs';
import { CarrerasModel } from '../models/carreras.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class LibresService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllLibres(): Observable<LibresModel[]>{
    return this.#httpClient.get<LibresModel[]>(`${environment.urlLibres}`);
  }

  getLibreById(idLibre: number): Observable<LibresModel>{
    return this.#httpClient.get<LibresModel>(`${environment.urlLibres}/${idLibre}`);
  }

  getCarreraByIdLibre(idLibre: number): Observable<CarrerasModel>{
    return this.#httpClient.get<CarrerasModel>(`${environment.urlLibres}/${idLibre}/carrera`);
  }
}
