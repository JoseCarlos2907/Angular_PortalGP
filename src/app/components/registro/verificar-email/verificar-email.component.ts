import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { UsuariosModel } from '../../../models/usuarios.model';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-verificar-email',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './verificar-email.component.html',
  styleUrl: './verificar-email.component.css'
})
export class VerificarEmailComponent {
  
  // Servicios del componente
  #router: Router = inject(Router);
  #authService: AuthService = inject(AuthService);


  // Variables del componente
  correoUsuario: any = null;
  contraseniaUsuario: string | null = null;


  async ngOnInit(){
    let correo = await this.#authService.fbUserEmail()

    if(correo == null || correo == undefined){
      this.goToPaso2();
    }else{
      this.#authService.fbUserCredentials().then((credenciales) => {
        if(credenciales == null && this.correoUsuario != null && this.contraseniaUsuario != null){
          this.#authService.fbSendVerificationEmail();
        }
      });
    }

    localStorage.clear();

    if(this.correoUsuario != null && this.contraseniaUsuario != null){
      localStorage.setItem('regCorreo', this.correoUsuario);
      localStorage.setItem('regContrasenia', this.contraseniaUsuario);
    }
  }


  // Esta función te manda a seguir el usuario
  finalizarRegistro(){
    this.#authService.fbUserCredentials().then((credenciales) => {
      if(credenciales != null && this.correoUsuario != null && this.contraseniaUsuario != null){
        this.#router.navigate(['/reg/seguir-pilotos']);
      }else{
        if(this.correoUsuario != null && this.contraseniaUsuario != null){
          this.#authService.fbLogin(this.correoUsuario, this.contraseniaUsuario);
          this.#router.navigate(['/reg/seguir-pilotos']);
          
        }else{
          console.log('Chungo si llega aqui');
        }
      }
    });
  }

  // Esta función te envia otra verificación de email
  volverAEnviarCorreo(){
    this.#authService.fbSendVerificationEmail();
  }

  // Esta función te manda al paso 1
  goToPaso1(){
    this.#router.navigate(['/reg/paso1']);
  }

  // Esta función te manda al paso 2
  goToPaso2(){
    this.#router.navigate(['/reg/paso2']);
  }
}
