import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { ComentariosModel } from '../../../models/comentarios.model';
import { UsuariosModel } from '../../../models/usuarios.model';

import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { AsyncPipe } from '@angular/common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HeaderSmComponent } from '../../header-sm/header-sm.component';
import { AuthService } from '../../../services/auth.service';

export interface Comentarios{
  idUsuario: number,
  nombreUsuario: string,
  idPiloto: number,
  nombrePiloto: string,
  nombreCarrera: string,
  idCarrera: number,
  comentario: string
}

@Component({
  selector: 'app-ajeno',
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderSmComponent,

    MatTabsModule,
    AsyncPipe,
  ],
  templateUrl: './ajeno.component.html',
  styleUrl: './ajeno.component.css'
})
export class AjenoComponent {
  
  // Servicios del componente
  #actRoute: ActivatedRoute = inject(ActivatedRoute);
  #usuariosService: UsuariosService = inject(UsuariosService);
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  #router: Router = inject(Router);
  #authService: AuthService = inject(AuthService);


  // Variables del componente
  @ViewChild('tabContent') tabContent!: ElementRef;
  num = 0;

  idUsuarioAjeno!: number;
  nombreUsuario!: string | null;
  imgPerfil!: string | null;
  seguidores: any = 0;
  seguidos: any = 0;
  sigueUsuario!: boolean;
  numComentariosCargados: number = 6;
  comentarios: any = [];
  comentariosCargados: any = [];
  comprobanteAnchoPantalla: boolean = true;
  temaSeleccionado!: number;


  ngOnInit(){
    // Recogemos el tema que tenga el usuario seleccionado para asociarlo al estilo de la página y si no está iniciado sesión se pone el predeterminado
    let tema = localStorage.getItem('temaSeleccionado');
    if(tema != null){
      this.temaSeleccionado = parseInt(tema);
    }else{
      this.temaSeleccionado = 0;
    }

    // Header segun ancho de pantalla
    this.#breakpointObserver.observe(['(max-width: 1025px)']).subscribe((state: BreakpointState) => {
      if(state.matches){
        this.comprobanteAnchoPantalla = true;
      }else{
        this.comprobanteAnchoPantalla = false;
      }
    });

    this.idUsuarioAjeno = this.#actRoute.snapshot.params['id'];
    this.#usuariosService.getUsuarioById(this.idUsuarioAjeno).subscribe(async (usr) => {
      this.nombreUsuario = await usr.nombreUsuario;
      this.imgPerfil = await usr.imgPerfil;
    });

    this.#usuariosService.getComentariosByIdUsuario(this.idUsuarioAjeno).subscribe(async (comentarios) => {
      this.comentarios = await comentarios;
      console.log(comentarios);
      
      
      if(this.comentarios != 'Este usuario no ha hecho ningún comentario' && this.comentarios.length >= 6){
        for (let i = 0; i < this.numComentariosCargados; i++) {
          this.comentariosCargados.push(this.comentarios[i]);
        }
      }else if(this.comentarios.length < 6){
        this.comentariosCargados = this.comentarios
        this.numComentariosCargados = comentarios.length
      }
    });


    this.#usuariosService.getSeguidoresByIdUsuario(this.idUsuarioAjeno).subscribe(async (seguidores) => {
      if(seguidores != 'Este usuario no tiene seguidores'){
        this.seguidores = await seguidores.length;

        let idUsuario = localStorage.getItem('idUsuario');
        let filtrado = seguidores.filter((seguidor: any) => seguidor.idUsuario == idUsuario);
        if(filtrado.length > 0){
          this.sigueUsuario = true;
        }
      }
    });
    
    this.#usuariosService.getSeguidosByIdUsuario(this.idUsuarioAjeno).subscribe(async (seguidos) => {
      if(seguidos != 'Este usuario no tiene seguidos'){
        this.seguidos = await seguidos.length;
      }
    });
  }


  // Esta función se ejecuta cuando el scroll del contenido del tab llega al final, lo que hace es añadir comentarios a un array con cargados
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atBottom) {
      if(this.numComentariosCargados+5 < this.comentarios.length){
        for (let i = this.numComentariosCargados; i < this.numComentariosCargados + 5; i++) {
          this.comentariosCargados.push(this.comentarios[i]);
        }
        this.numComentariosCargados += 5;
      }else{
        for (let i = this.numComentariosCargados; i < this.comentarios.length; i++) {
          this.comentariosCargados.push(this.comentarios[i]);
        }
        this.numComentariosCargados = this.comentariosCargados.length;
      }
    }
  }

  // Esta función se ejecuta al darle a dejar de seguir el usuario
  dejarDeSeguirUsuario(){
    this.sigueUsuario = false;

    let idSeguidor = localStorage.getItem('idUsuario');

    if(idSeguidor != null && this.idUsuarioAjeno != undefined){
      this.#usuariosService.dejarDeSeguirUsuario(idSeguidor, this.idUsuarioAjeno.toString()).subscribe((msg) => {
        console.log(msg);
      });
    }
  }

  // Esta función se ejecuta al darle a seguir el usuario
  async seguirUsuario(){
    let isVerified = await this.#authService.fbIsUserVerified();

    if(isVerified){
      this.sigueUsuario = true;
  
      let idSeguidor = localStorage.getItem('idUsuario');
  
      if(idSeguidor != null && this.idUsuarioAjeno != undefined){
        this.#usuariosService.seguirUsuario(idSeguidor, this.idUsuarioAjeno.toString()).subscribe((msg) => {
          console.log(msg);
        });
      }
    }else{
      this.#router.navigate(['/reg/verificar-email']);
    }
  }
}
