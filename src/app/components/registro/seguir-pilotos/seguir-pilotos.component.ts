import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PilotosService } from '../../../services/pilotos.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-seguir-pilotos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seguir-pilotos.component.html',
  styleUrl: './seguir-pilotos.component.css'
})
export class SeguirPilotosComponent {
  
  // Servicios del componente
  #router: Router = inject(Router);
  #authService: AuthService = inject(AuthService);
  #pilotosService: PilotosService = inject(PilotosService);
  #usuariosService: UsuariosService = inject(UsuariosService);
  

  // Variables del componente
  pilotos: {id: number, seguir: boolean}[] = [];
  correoUsuario!: string | null;


  ngOnInit(){
    this.#authService.fbLogout();

    this.correoUsuario = localStorage.getItem('regCorreo');
    let contraseniaUsuario = localStorage.getItem('regContrasenia');

    if(this.correoUsuario != null && contraseniaUsuario != null){
      this.#authService.fbLogin(this.correoUsuario, contraseniaUsuario);
    }

    this.#authService.fbIsUserVerified().then((isVerified) => {
      if(isVerified == false){
        this.#router.navigate(['/reg/verificar-email']);
      }
    });


    this.#pilotosService.getAllPilotos().subscribe((pilotos) => {
      pilotos.forEach(piloto => {
        this.pilotos.push({id:piloto.idPiloto, seguir: false});
      });
    })
  }

  // Esta función te manda al home cuando terminas de seguir los pilotos
  goToHome(){
    let pilotosSeguidos = this.pilotos.filter(piloto => piloto['seguir'] == true);

    let idPilotos = [];
    for (const piloto of pilotosSeguidos) {
      idPilotos.push(piloto.id);
    }

    if(this.correoUsuario != null){
      this.#usuariosService.seguirPilotosRegistro(this.correoUsuario, idPilotos).subscribe({
        next: console.log,
        
        error: console.log
      });
    }

    this.#authService.fbLogout();
    localStorage.clear();
    this.#router.navigate(['/home/true']);
  }

  // Esta función cambia entre seguir y no seguir un piloto
  seguirPiloto(piloto: number){
    this.pilotos[piloto].seguir = !this.pilotos[piloto].seguir;
  }
}
