import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatLabel, MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { UsuariosModel } from '../../../models/usuarios.model';

@Component({
  selector: 'app-paso2',
  standalone: true,
  imports: [
    MatLabel, 
    MatFormField, 
    MatIcon, 
    MatFormFieldModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatInput, 
    MatButton, 
    MatButtonModule,
  ],
  templateUrl: './paso2.component.html',
  styleUrl: './paso2.component.css'
})
export class Paso2Component {
  
  // Servicios del componente
  #router: Router = inject(Router);
  #authService: AuthService = inject(AuthService);
  #usuariosService: UsuariosService = inject(UsuariosService);


  // Variables del componente
  paso2RegForm: FormGroup = new FormGroup({
    contrasenia : new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&€#.,$($)$-$_+-])([A-Za-z\d$@$!%€*?&]|[^ ]){8,100}$/)],),
    confirmarContrasenia: new FormControl ('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&€#.,$($)$-$_+-])([A-Za-z\dº797$@$!%€*?&]|[^ ]){8,100}$/)]),
  });

  hide1 = true;
  hide2 = true;

  ngOnInit(){
    let correo = localStorage.getItem('regCorreo');

    if(correo == null || correo.length === 0){
      this.goToPaso1();
    }
  }

  // Esta función vuelve al paso 1
  goToPaso1(){
    this.#router.navigate(['/reg/paso1']);
  }

  // Esta función te manda a la validación de email
  goToValidateEmail(){
    if(
      this.paso2RegForm.value.contrasenia == "" ||
      this.paso2RegForm.value.confirmarContrasenia == ""
      ){
      console.log("Ambas contraseñas deben estar rellenas");
    }else if(this.checkContrasenias()){
      console.log("Las contraseñas deben ser iguales");
    }else{
      localStorage.setItem('regContrasenia', this.paso2RegForm.value.contrasenia);
      let correoUsuario = localStorage.getItem('regCorreo');

      // Registramos el usuario en la base de datos
      let datosUsuario =
      {
        'imgPerfil': localStorage.getItem('regImgPerfil'),
        'nombre': localStorage.getItem('regNombre'),
        'apellidos': localStorage.getItem('regApellidos'),
        'fechaNac': localStorage.getItem('regFechaNac'),
        'nombreUsuario': localStorage.getItem('regNombreUsuario'),
        'correo': correoUsuario,
        'idPais': localStorage.getItem('regIdPais'),
        'contrasenia': this.paso2RegForm.value.contrasenia,
        'rol': 'usuario',
        'temaSeleccionado': 0
      };

      this.#usuariosService.registrarUsuario(datosUsuario).subscribe((msg) => {
        console.log(msg);
      });

      // Registramos el usuario en FireBase con el correo y su contraseña
      if(correoUsuario != null){
        this.#authService.fbRegister(correoUsuario, this.paso2RegForm.value.contrasenia);
      }
      
      this.#router.navigate(['reg/verificar-email']);
    }
  }

  // Esta función comprueba las contraseñas
  checkContrasenias(){
    if(this.paso2RegForm.value.contrasenia === this.paso2RegForm.value.confirmarContrasenia){
      return false;
    }else{
      return true;
    }
  }
}
