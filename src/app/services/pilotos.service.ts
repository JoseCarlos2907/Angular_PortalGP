import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PilotosModel } from '../models/pilotos.model';
import { PaisesModel } from '../models/paises.model';
import { CochesModel } from '../models/coches.model';
import { UsuariosModel } from '../models/usuarios.model';
import { ComentariosModel } from '../models/comentarios.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PilotosService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllPilotos(): Observable<PilotosModel[]>{
    return this.#httpClient.get<PilotosModel[]>(`${environment.urlPilotos}`);
  }

  getPilotoById(idPiloto: number): Observable<PilotosModel>{
    return this.#httpClient.get<PilotosModel>(`${environment.urlPilotos}/piloto/${idPiloto}`);
  }

  getPaisByIdPiloto(idPiloto: number): Observable<PaisesModel>{
    return this.#httpClient.get<PaisesModel>(`${environment.urlPilotos}/${idPiloto}/pais`);
  }

  getCocheByIdPiloto(idPiloto: number): Observable<CochesModel>{
    return this.#httpClient.get<CochesModel>(`${environment.urlPilotos}/${idPiloto}/coche`);
  }

  getSeguidoresByIdPiloto(idPiloto: number): Observable<UsuariosModel[]>{
    return this.#httpClient.get<UsuariosModel[]>(`${environment.urlPilotos}/${idPiloto}/usuarios-seguidores`);
  }

  getComentariosByIdPiloto(idPiloto: number): Observable<ComentariosModel[]>{
    return this.#httpClient.get<ComentariosModel[]>(`${environment.urlPilotos}/${idPiloto}/comentarios`);
  }

  getDatosClasificacionOficial(): Promise<any>{
    return this.#httpClient.get<any>(`${environment.urlPilotos}/datos-clasificacion-oficial`).toPromise();
  }

  getDatosClasificacionComunidad(): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlPilotos}/datos-clasificacion-comunidad`);
  }

  getDatosPerfilPiloto(idPiloto: number): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlPilotos}/${idPiloto}/datos-perfil`);
  }

  getPuntuacionesPiloto(idPiloto: number): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlPilotos}/${idPiloto}/puntuaciones`);
  }


  // Metodos POST
  seguirPiloto(idSeguidor: string, idPiloto: string): Observable<any>{
    return this.#httpClient.post<any>(`${environment.urlPilotos}/seguir`, `{"idSeguidor": "${idSeguidor}", "idPiloto": "${idPiloto}"}`);
  }

  dejarDeSeguirPiloto(idSeguidor: string, idPiloto: string): Observable<any>{
    return this.#httpClient.post<any>(`${environment.urlPilotos}/no-seguir`, `{"idSeguidor": "${idSeguidor}", "idPiloto": "${idPiloto}"}`);
  }
}
