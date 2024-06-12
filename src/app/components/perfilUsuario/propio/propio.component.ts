import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { Router, RouterModule } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';
import { UsuariosService } from '../../../services/usuarios.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HeaderSmComponent } from '../../header-sm/header-sm.component';

export interface SeguidoresYSeguidos{
  idUsuario: number, 
  nombreUsuario: string, 
  numComentarios: number
}

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
  selector: 'app-propio',
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderSmComponent,

    MatTabsModule,
    RouterModule
  ],
  templateUrl: './propio.component.html',
  styleUrl: './propio.component.css'
})
export class PropioComponent {

  // Servicios del componente
  #router: Router = inject(Router);
  #usuariosService: UsuariosService = inject(UsuariosService);
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver);


  // Variables del componente
  idUsuario!: any;
  nombreUsuario!: any;
  comprobanteAnchoPantalla: boolean = true;
  temaSeleccionado!: number;

  nSeguidores: number = 0;
  nSeguidos: number = 0;
  
  numSeguidoresCargados: number = 6;
  seguidores: any = [];
  seguidoresCargados: any = [];
  
  numComentariosCargados: number = 6;
  comentarios: any = [];
  comentariosCargados: any = [];
  
  numSeguidosCargados: number = 6;
  seguidos: any = [];
  seguidosCargados: any = [];
  

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

    this.nombreUsuario = localStorage.getItem('nombreUsuario');

    this.idUsuario = localStorage.getItem('idUsuario');
    this.#usuariosService.getSeguidoresByIdUsuario(this.idUsuario).subscribe(async (seguidores) => {
      this.seguidores = await seguidores;

      if(this.seguidores != 'Este usuario no tiene seguidores'){
        for (let i = 0; i < this.numSeguidoresCargados; i++) {
          this.seguidoresCargados.push(this.seguidores[i]);
        }
        this.nSeguidores = seguidores.length
      }else if(this.seguidores.length < 6){
        seguidores.forEach((seguidor: SeguidoresYSeguidos) => {
          this.seguidosCargados.push(seguidor);
        });
        this.nSeguidores = seguidores.length
        this.numSeguidoresCargados = seguidores.length
      }
    });
    
    this.#usuariosService.getSeguidosByIdUsuario(this.idUsuario).subscribe(async (seguidos) => {
      this.seguidos = await seguidos;
      console.log(seguidos);
      

      if(seguidos != 'Este usuario no tiene seguidos'){
        for (let i = 0; i < this.numSeguidosCargados; i++) {
          this.seguidosCargados.push(this.seguidos[i]);
        }
        this.nSeguidos = seguidos.length
      }else if(seguidos.length < 6){
        seguidos.forEach((seguido: SeguidoresYSeguidos) => {
          this.seguidosCargados.push(seguido);
        });
        this.nSeguidos = seguidos.length
        this.numSeguidosCargados = seguidos.length
      }
    });

    this.#usuariosService.getComentariosByIdUsuario(this.idUsuario).subscribe(async (comentarios) => {
      this.comentarios = await comentarios;
      
      
      if(this.comentarios != 'Este usuario no ha hecho ningún comentario' && this.comentarios.length >= 6){
        for (let i = 0; i < this.numComentariosCargados; i++) {
          this.comentariosCargados.push(this.comentarios[i]);
        }
      }else if(this.comentarios.length < 6){
        this.comentariosCargados = this.comentarios
        this.numComentariosCargados = comentarios.length
      }
    });
  }


  // Las siguientes tres funciones controlan el scroll del contenido de los tabs
  @ViewChild('tabContent') tabContent1!: ElementRef;
  @ViewChild('tabContent') tabContent2!: ElementRef;
  @ViewChild('tabContent') tabContent3!: ElementRef;

  @HostListener('scroll', ['$event'])
  onScrollSeguidores(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atBottom) {
      if(this.numSeguidoresCargados+5 < this.seguidores.length){
        for (let i = this.numSeguidoresCargados; i < this.numSeguidoresCargados + 5; i++) {
          this.seguidoresCargados.push(this.seguidores[i]);
        }
        this.numSeguidoresCargados += 5;
      }else{
        for (let i = this.numSeguidoresCargados; i < this.seguidores.length; i++) {
          this.seguidoresCargados.push(this.seguidores[i]);
        }
        this.numSeguidoresCargados = this.seguidoresCargados.length;
      }
    }
  }
  

  @HostListener('scroll', ['$event'])
  onScrollComentarios(event: any) {
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



  @HostListener('scroll', ['$event'])
  onScrollSeguidos(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atBottom) {
      if(this.numSeguidosCargados+5 < this.seguidos.length){
        for (let i = this.numSeguidosCargados; i < this.numSeguidosCargados + 5; i++) {
          this.seguidosCargados.push(this.seguidos[i]);
        }
        this.numSeguidosCargados += 5;
      }else{
        for (let i = this.numSeguidosCargados; i < this.seguidos.length; i++) {
          this.seguidosCargados.push(this.seguidos[i]);
        }
        this.numSeguidosCargados = this.seguidosCargados.length;
      }
    }
  }


  // Esta función te envía a la ruta que se le especifique como parámetro
  goTo(ruta: string){
    this.#router.navigate([ruta]);
  }

  // Esta función te manda a la configuración de la cuenta
  goToConfCuenta(){
    let id = localStorage.getItem('idUsuario');
    this.#router.navigate(['/conf-cuenta',`/${id}`]);
  }

  // Esta función te manda a ver el perfil del usuario al que clickees
  goToVerPerfil(idUsuario: number){
    this.#router.navigate(['/usuario-ajeno',`${idUsuario}`]);
  }

  // Esta función hace que dejes de seguir el usuario del que pulses el botón este
  dejarDeSeguirUsuario(idUsuario: number){
    this.#usuariosService.dejarDeSeguirUsuario(this.idUsuario, idUsuario.toString()).subscribe((msg) => {
      console.log(msg);
    });

    window.location.reload();
  }
}
