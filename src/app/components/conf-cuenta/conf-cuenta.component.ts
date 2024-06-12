import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service';
import { MatLabel, MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { ConfirmarEliminacionCuentaComponent } from '../confirmar-eliminacion-cuenta/confirmar-eliminacion-cuenta.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HeaderSmComponent } from '../header-sm/header-sm.component';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-conf-cuenta',
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderSmComponent,

    MatLabel, 
    MatFormField, 
    MatFormFieldModule,
    MatInputModule, 
    MatInput,
    MatButton, 
    MatButtonModule,
    ReactiveFormsModule,
    MatRadioButton,
    MatRadioModule,

    AccordionModule,
    ButtonModule,
  ],
  templateUrl: './conf-cuenta.component.html',
  styleUrl: './conf-cuenta.component.css'
})
export class ConfCuentaComponent {

  // Variables del componente
  temaSeleccionado!: number;
  base64Image!: string | null;
  correoUsuario!: string | null;

  formDatosPrincipales: FormGroup = new FormGroup({
    newNombreUsuario: new FormControl(''),
    newNombre: new FormControl(''),
    newApellidos: new FormControl(''),
  });

  formContrasenia: FormGroup = new FormGroup({
    oldContrasenia: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&€#.,$($)$-$_+-])([A-Za-z\d$@$!%€*?&]|[^ ]){8,100}$/)]),
    newContrasenia: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&€#.,$($)$-$_+-])([A-Za-z\d$@$!%€*?&]|[^ ]){8,100}$/)]),
    newContraseniaRepetida: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&€#.,$($)$-$_+-])([A-Za-z\d$@$!%€*?&]|[^ ]){8,100}$/)]),
  });

  hide1 = true;
  hide2 = true;
  hide3 = true;

  formTemaSeleccionado: FormGroup = new FormGroup({
    temaSeleccionado: new FormControl('', [Validators.required])
  });

  comprobanteAnchoPantalla: boolean = true;
  
  // Servicios del componente
  #authService: AuthService = inject(AuthService);
  #router: Router = inject(Router);
  #dialog: MatDialog = inject(MatDialog);
  #usuariosService: UsuariosService = inject(UsuariosService);
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver)
  #snacBarService: SnackBarService = inject(SnackBarService);

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

    // Obtenemos valores del localStorage que nos van a hacer falta para mostrarlos en campos posteriormente
    this.correoUsuario = localStorage.getItem('correo');
    let nombreUsuario = localStorage.getItem('nombreUsuario');
    let nombre = localStorage.getItem('nombre');
    let apellidos = localStorage.getItem('apellidos');
    let imgPerfil = localStorage.getItem('imgPerfil');
    
    // Si ninguno de estos campos no es nulo se asocian los valores al formulario de datos principales
    if(nombreUsuario != null && nombre != null && apellidos != null){
      this.formDatosPrincipales.setValue({
        newNombreUsuario: nombreUsuario,
        newNombre: nombre,
        newApellidos: apellidos
      });
    }
  
    // Con el tema seleccionado hacemos lo mismo
    if(tema != null){
      this.formTemaSeleccionado.setValue({
        temaSeleccionado: tema?.toString(),
      });
    }

    // Y con la imagen de perfil la asociamos directamente
    this.base64Image = imgPerfil;
  }

  // Se recoge el valor el elemento que contenga la imagen para seleccionar la nueva imagen
  seleccionarNuevaFoto(){
    let input: HTMLInputElement | null = document.querySelector('input[id=imagenNueva]');
    if(input !== null){
      input.click();
    }
  }

  // Esta función es la que se ejecuta al cambiar la imagen del campo, ejecutando la función de debajo
  handle(e: Event){
    console.log('Imagen nueva añadida');
    this.handleImageUpload(e);
  }

  // Esta es la función que ejecuta la función superior, lo que hace es transformar la imagen en base 64, controlar que cumpla los requisitos e imprimir la información de la nueva imagen introducida
  handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];

    if(file!=undefined){  
      const fileReader = new FileReader();
    fileReader.onloadend = () => {  
        const image = new Image();
        image.onload = () => {  
            const width = image.width;
            const height = image.height;
            const format = file.type.split('/')[1];
            console.log(`Formato: ${format}, Ancho: ${width}px, Alto: ${height}px`);
            console.log("Longitud de la cadena: " + (fileReader.result as string).length);
            if ((format === 'jpeg' || format === 'png')) { 
              this.base64Image = fileReader.result as string;
              console.log(this.base64Image);
              console.log("Longitud de la cadena: " + this.base64Image.length);
            } else if (format !== 'jpeg' && format !== 'png') { 
              console.log('El archivo seleccionado no es una imagen jpg o png');
            } else if ((fileReader.result as string).length > 4294967295 ) {   
              console.log('La imagen pesa más de 4GB animaaal');
            }
        };
        image.onerror = () => { 
          console.log("El archivo seleccionado no es un archivo de imagen válido.");
        }

        image.src = fileReader.result as string;
    };

    fileReader.readAsDataURL(file);
    }
  }


  // Esta es la función que se ejecuta al confirmar los cambios principales del usuario
  cambiosDatosPrincipales(){
    console.log(this.formDatosPrincipales.value);
    if(this.correoUsuario != null && this.base64Image != null){
      this.#usuariosService.cambiarDatosPrincipalesUsuario(
        this.correoUsuario,
        this.formDatosPrincipales.value.newNombre,
        this.formDatosPrincipales.value.newNombreUsuario,
        this.formDatosPrincipales.value.newApellidos,
        this.base64Image
      ).subscribe((msg) => {
        console.log(msg);
      })
    }

    localStorage.setItem('nombreUsuario', this.formDatosPrincipales.value.newNombreUsuario);
    localStorage.setItem('nombre', this.formDatosPrincipales.value.newNombre);
    localStorage.setItem('apellidos', this.formDatosPrincipales.value.newApellidos);

    if(this.base64Image != null){
      localStorage.setItem('imgPerfil', this.base64Image);
    }
    
    this.#snacBarService.openSuccessSnackBar('Cambios de datos principales efectuados correctamente');
  }

  // Esta es la función que se ejecuta al confirmar los cambios de contraseña
  cambiarContrasenia(){
    if(
      this.formContrasenia.value.newContrasenia == "" ||
      this.formContrasenia.value.newContraseniaRepetir == ""
      ){
      console.log("Todos los campos deben estar rellenos");
      this.#snacBarService.openErrorSnackBar('Todos los campos deben estar rellenos');
    }else if(this.checkContrasenias()){
      console.log("Las contraseñas deben ser iguales");
      this.#snacBarService.openErrorSnackBar('Las contraseñas deben ser iguales');
      }else{
        this.#authService.fbChangePassword(this.formContrasenia.value.oldContrasenia, this.formContrasenia.value.newContrasenia);
        this.#snacBarService.openSuccessSnackBar('Cambio de contraseña efectuado correctamente');
    }
  }

  // Esta función comprueba que las contraseñas sean iguales
  checkContrasenias(){
    if(this.formContrasenia.value.contrasenia === this.formContrasenia.value.confirmarContrasenia){
      return false;
    }else{
      return true;
    }
  }

  // Esta es la función que se ejecuta cuando se confirma el cambio de tema
  cambiarTema(){
    if(this.correoUsuario != null){
      this.#usuariosService.cambiarTemaSeleccionadoUsuario(this.correoUsuario, this.formTemaSeleccionado.value.temaSeleccionado.toString()).subscribe((msg) => {
        console.log(msg);
      });
    }

    localStorage.setItem('temaSeleccionado', this.formTemaSeleccionado.value.temaSeleccionado.toString());
    this.#snacBarService.openSuccessSnackBar('Cambio de tema efectuado correctamente');
    window.location.reload();
  }
  
  // Esta es la función con la que se cierra la sesión del usuario tanto en Firebase como en la aplicación
  cerrarSesion(){
    this.#authService.fbLogout();
    localStorage.clear();
    this.#router.navigate(['/home']);
    this.#snacBarService.openSuccessSnackBar('Se ha cerrado la sesión del usuario');
  }

  // Esta función te abre el modal para confirmar la eliminación del usuario
  eliminarCuenta(){
    this.#dialog.open(ConfirmarEliminacionCuentaComponent);
  }
}
