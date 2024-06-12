import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CochesModel } from '../models/coches.model';
import { Observable } from 'rxjs';
import { EscuderiasModel } from '../models/escuderias.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CochesService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllCoches(): Observable<CochesModel[]>{
    return this.#httpClient.get<CochesModel[]>(`${environment.urlCoches}`);
  }

  getCocheById(idCoche: number): Observable<CochesModel>{
    return this.#httpClient.get<CochesModel>(`${environment.urlCoches}/${idCoche}`);
  }

  getEscuderiaByIdCoche(idCoche: number): Observable<EscuderiasModel>{
    return this.#httpClient.get<EscuderiasModel>(`${environment.urlCoches}/${idCoche}/escuderia`);
  }
}
