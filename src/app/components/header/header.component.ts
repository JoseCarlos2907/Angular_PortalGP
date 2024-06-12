import { Component, Input, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SkeletonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  // Servicios inyectados
  #route: Router = inject(Router);
  #dialog: MatDialog = inject(MatDialog);
  #authService: AuthService = inject(AuthService);

  
  // Variables del componente
  @Input() comeFromReg?: string;
  @Input() temaSeleccionado!: number;

  loggeado!: boolean;
  isAdmin!: boolean;
  rolUsuario!: string | null;
  imgPerfilUsuario !: string | null;


  ngOnInit(){
    document.documentElement.scrollTop = 0;
    this.getLoggedUser();

    if(this.comeFromReg == 'true'){
      this.#dialog.open(ModalLoginComponent);
    }
  }

  // Recogemos los valores del usuario para ver si está iniciado sesión o no
  getLoggedUser(){
    this.rolUsuario = localStorage.getItem('rol');
    this.imgPerfilUsuario = localStorage.getItem('imgPerfil');

    this.#authService.fbUserCredentials().then((usuario) => {
      let usr = usuario;
      console.log(usr);
      

      if(usr == null || usr == undefined){
        this.loggeado = false;
  
      }else{
        this.loggeado = true;
  
        
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
