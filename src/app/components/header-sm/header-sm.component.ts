import { Component, Output, EventEmitter, inject, Input } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { SkeletonModule } from 'primeng/skeleton';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-header-sm',
  standalone: true,
  imports: [
    SidebarModule,
    MatButtonModule,
    SkeletonModule,
  ],
  templateUrl: './header-sm.component.html',
  styleUrl: './header-sm.component.css'
})
export class HeaderSmComponent {

  // Servicios del componente
  #route: Router = inject(Router);
  #dialog: MatDialog = inject(MatDialog);
  #authService: AuthService = inject(AuthService);
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver)
  
  
  // Variables del componente
  @Input() temaSeleccionado!: number;

  abierto = false;
  loggeado!: boolean;
  isAdmin!: boolean;
  rolUsuario!: string | null;
  imgPerfilUsuario !: string | null;
  menor600px!: boolean;


  ngOnInit(){
    this.getLoggedUser();
  }

  // Esta función abre o cierra el menú de la izquierda
  toggleSidenav(){
    this.abierto = !this.abierto;
  }

  // Recogemos los valores del usuario para ver si está iniciado sesión o no
  getLoggedUser(){
    this.#breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      let breakpoints = result.breakpoints;

      if(breakpoints[Breakpoints.XSmall]){
        this.menor600px = true;
      }else if(breakpoints[Breakpoints.Large] || breakpoints[Breakpoints.XLarge] || breakpoints[Breakpoints.Medium] || breakpoints[Breakpoints.Small]){
        this.menor600px = false;
      }
    });


    this.#authService.fbUserCredentials().then((usuario) => {
      let usr = usuario;
      console.log(usr);
      

      if(usr == null || usr == undefined){
        this.loggeado = false;
  
      }else{
        this.loggeado = true;
  
        this.rolUsuario = localStorage.getItem('rol');
        
        this.imgPerfilUsuario = localStorage.getItem('imgPerfil');
        if(this.rolUsuario == "admin"){
          this.isAdmin = true;
        }else{
          this.isAdmin = false;
        }
      }
    });
  }

  // Esta función abre el modal de login
  identificarse(){
    this.#dialog.open(ModalLoginComponent);
  }

  // Esta función te envía al perfil de tu usuario
  configuracionCuenta(){
    let id = localStorage.getItem('idUsuario');
    this.#route.navigate(['/usuario-propio',`/${id}`]);
  }

  // Esta función te envía a la ruta que le especifiques como parámetro en el html
  goTo(enlace: string){
    this.#route.navigate([enlace]);
  }
}
