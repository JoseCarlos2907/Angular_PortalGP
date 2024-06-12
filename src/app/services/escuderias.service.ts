import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EscuderiasModel } from '../models/escuderias.model';
import { Observable } from 'rxjs';
import { PaisesModel } from '../models/paises.model';
import { CochesModel } from '../models/coches.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EscuderiasService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllEscuderias(): Observable<EscuderiasModel[]>{
    return this.#httpClient.get<EscuderiasModel[]>(`${environment.urlEscuderias}`);
  }

  getEscuderiaById(idEscuderia: number): Observable<EscuderiasModel>{
    return this.#httpClient.get<EscuderiasModel>(`${environment.urlEscuderias}/escuderia/${idEscuderia}`);
  }
  
  getPaisByIdEscuderia(idEscuderia: number): Observable<PaisesModel>{
    return this.#httpClient.get<PaisesModel>(`${environment.urlEscuderias}/${idEscuderia}/pais`);
  }

  getCocheByIdEscuderia(idEscuderia: number): Observable<CochesModel>{
    return this.#httpClient.get<CochesModel>(`${environment.urlEscuderias}/${idEscuderia}/coche`);
  }

  getDatosClasificacionComunidad(): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlEscuderias}/datos-clasificacion-oficial`);
  }

  getDatosPerfilEscuderia(idEscuderia: number): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlEscuderias}/${idEscuderia}/datos-perfil`);
  }

}
