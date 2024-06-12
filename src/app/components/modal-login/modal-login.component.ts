import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatLabel, MatFormField, MatFormFieldModule, MatFormFieldControl } from "@angular/material/form-field";
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuariosModel } from '../../models/usuarios.model';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosService } from '../../services/usuarios.service';
import { ModalPswdOlvidadaComponent } from '../modal-pswd-olvidada/modal-pswd-olvidada.component';

@Component({
  selector: 'app-modal-login',
  standalone: true,
  imports: [MatLabel, MatFormField, MatIcon, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatInput, MatButton, MatButtonModule],
  templateUrl: './modal-login.component.html',
  styleUrl: './modal-login.component.css',
  providers: []
})
export class ModalLoginComponent {
  
  // Servicios del componente
  #router: Router = inject(Router);
  #authService: AuthService = inject(AuthService);
  #usuariosService: UsuariosService = inject(UsuariosService);
  #dialog: MatDialog = inject(MatDialog)


  // Variables del componente
  loginForm: FormGroup = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    contrasena: new FormControl('', [Validators.required])
  });

  hide = true;

  // Esta función cierra todos los modales
  cerrarModal(){
    this.#dialog.closeAll();
  }

  // Esta es la función que se ejecuta al iniciar sesión en el modal
  async loginUser(){
    if(this.loginForm.value.correo == "" || this.loginForm.value.contrasena == ""){
      console.log("Debe rellenar ambos campos para poder iniciar sesión");
    }else{
      let correoLogin: string = this.loginForm.value.correo;
      let contrasenaLogin: string = this.loginForm.value.contrasena;
      
      this.#authService.fbLogin(correoLogin, contrasenaLogin).then(async () => {

        
        this.#authService.fbUserEmail().then(async (correo) => {
        console.log("Correo: " + await correo);

          this.#authService.fbIsUserVerified().then(async (verificado) => {
            console.log("Verificado: " + await verificado);
            
            if(correo != null || correo != undefined){
              this.#usuariosService.getUsuarioByCorreo(correo).subscribe({
                next: (usr) => {
                  console.log('Usuario: ' + usr);
                  
                  let nombre = usr.nombre;
                  let apellidos = usr.apellidos;
                  let nombreUsuario = usr.nombreUsuario;
                  let correo = usr.correo;
                  let fechaNac = usr.fechaNac;
                  let imgPerfil = usr.imgPerfil;
                  let temaSeleccionado = usr.temaSeleccionado?.toString();
                  let rol = usr.rol;
                  let idUsuario = usr.idUsuario;
                  
                  if(
                    idUsuario != null &&
                    nombre != null &&
                    apellidos != null &&
                    nombreUsuario != null &&
                    correo != null &&
                    fechaNac != null &&
                    imgPerfil != null &&
                    temaSeleccionado?.toString() != null &&
                    rol != null
                  ){
                    
                    localStorage.setItem('nombre', nombre);
                    localStorage.setItem('apellidos', apellidos);
                    localStorage.setItem('nombreUsuario', nombreUsuario);
                    localStorage.setItem('correo', correo);
                    localStorage.setItem('fechaNac', fechaNac);
                    localStorage.setItem('imgPerfil', imgPerfil);
                    localStorage.setItem('temaSeleccionado', temaSeleccionado.toString());
                    localStorage.setItem('rol', rol);
                    localStorage.setItem('idUsuario', idUsuario.toString());

                    this.#dialog.closeAll();
                  }else{
                    console.log('Los datos del usuario no son los esperados');
                  }
                },
      
                error: console.log
              });
      
              if (verificado && verificado != undefined){
                setTimeout(() => {
                  this.#router.navigate(['/home']);
                  window.location.reload();
                }, 1600);
              }else{
                setTimeout(() => {
                  this.#router.navigate(['/reg/verificar-email']);
                }, 2000);
              }
            }else{
              this.#authService.fbLogout();
              console.log('Los datos introducidos son incorrectos o no existen');
            }
          });
          
        });
      });
    }
  }

  // Esta función te envía al paso 1 del registro
  goToRegisterUser(){
    this.#dialog.closeAll();
    this.#router.navigate(['/reg/paso1']);
  }

  // Esta función te abre un modal para recuperar la contraseña
  openResetPasswordModal(){
    this.#dialog.closeAll();
    this.#dialog.open(ModalPswdOlvidadaComponent);
  }
}
