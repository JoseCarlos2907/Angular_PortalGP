import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuariosModel } from '../models/usuarios.model';
import { PaisesModel } from '../models/paises.model';
import { ComentariosModel } from '../models/comentarios.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // Servicios Inyectados
  #httpClient: HttpClient = inject(HttpClient);


  // Metodos GET
  getAllUsuarios(): Observable<UsuariosModel[]>{
    return this.#httpClient.get<UsuariosModel[]>(`${environment.urlUsuarios}`);
  }

  getUsuarioById(idUsuario: number): Observable<UsuariosModel>{
    return this.#httpClient.get<UsuariosModel>(`${environment.urlUsuarios}/${idUsuario}`);
  }

  getPaisByIdUsuario(idUsuario: number): Observable<PaisesModel>{
    return this.#httpClient.get<PaisesModel>(`${environment.urlUsuarios}/${idUsuario}/pais`);
  }

  getSeguidoresByIdUsuario(idUsuario: number | undefined): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlUsuarios}/${idUsuario}/seguidores`);
  }

  getSeguidosByIdUsuario(idUsuario: number | undefined): Observable<any>{
    return this.#httpClient.get<any>(`${environment.urlUsuarios}/${idUsuario}/seguidos`);
  }

  getComentariosByIdUsuario(idUsuario: number): Observable<any[]>{
    return this.#httpClient.get<any[]>(`${environment.urlUsuarios}/${idUsuario}/comentarios`);
  }

  // Metodos POST
  getUsuarioByCorreo(correo: string): Observable<UsuariosModel>{
    return this.#httpClient.post<UsuariosModel>(`${environment.urlUsuarios}/gbe`, `{"correo": "${correo}"}`);
  }

  registrarUsuario(usuario: any): Observable<UsuariosModel>{
    return this.#httpClient.post<UsuariosModel>(`${environment.urlUsuarios}/registrar`, usuario);
  }

  seguirPilotosRegistro(correo: string, idUsuarios: Array<number>): Observable<any>{
    return this.#httpClient.post<any>(`${environment.urlUsuarios}/spr`, `{"correo": "${correo}", "pilotos": "${idUsuarios.join(",")}"}`);
  } 

  seguirUsuario(idSeguidor: string, idSeguido: string): Observable<any>{
    return this.#httpClient.post<any>(`${environment.urlUsuarios}/seguir`, `{"idSeguidor": "${idSeguidor}", "idSeguido": "${idSeguido}"}`);
  }

  dejarDeSeguirUsuario(idSeguidor: string, idSeguido: string): Observable<any>{
    return this.#httpClient.post<any>(`${environment.urlUsuarios}/no-seguir`, `{"idSeguidor": "${idSeguidor}", "idSeguido": "${idSeguido}"}`);
  }


  // Metodos PUT
  cambiarDatosPrincipalesUsuario(correo: string, nombre: string, nombreUsuario: string, apellidos: string, imgPerfil: string): Observable<any>{
    return this.#httpClient.put<any>(`${environment.urlUsuarios}/cambiar-datos-principales`, 
      `{"correo": "${correo}",
      "nombre": "${nombre}",
      "nombreUsuario": "${nombreUsuario}",
      "apellidos": "${apellidos}",
      "imgPerfil": "${imgPerfil}"}`
    );
  }

  cambiarTemaSeleccionadoUsuario(correo: string, temaSeleccionado: string): Observable<any>{
    return this.#httpClient.put<any>(`${environment.urlUsuarios}/cambiar-tema-seleccionado`, 
      `{"correo": "${correo}",
      "temaSeleccionado": "${temaSeleccionado}"}`
    );
  }


  // Metodos DELETE
  borrarUsuarioPorId(idUsuario: string): Observable<any>{
    return this.#httpClient.delete<any>(`${environment.urlUsuarios}/eliminar/${idUsuario}`);
  }
}
