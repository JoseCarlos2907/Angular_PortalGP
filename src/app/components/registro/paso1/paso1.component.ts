import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatLabel, MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';

import { InputGroupModule } from 'primeng/inputgroup';
import { PaisesModel } from '../../../models/paises.model';
import { PaisesService } from '../../../services/paises.service';
import { SnackBarService } from '../../../services/snack-bar.service';

@Component({
  selector: 'app-paso1',
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
    InputMaskModule, 
    FormsModule,
    InputGroupModule,
    MatAutocompleteModule,
    MatOptionModule,
  ],
  templateUrl: './paso1.component.html',
  styleUrl: './paso1.component.css'
})
export class Paso1Component {
  // Servicios inyectados
  #router: Router = inject(Router);
  #paisesService: PaisesService = inject(PaisesService);
  #snackBarService: SnackBarService = inject(SnackBarService);


  // Variables del componente
  paso1RegForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern('^[-a-zA-ZÁáÉéÍíÓóÚúñÑ ]+$')]),
    apellidos: new FormControl('', [Validators.required, Validators.pattern('^[-a-zA-ZÁáÉéÍíÓóÚúñÑ ]+$')]),
    nombreUsuario: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    fechaNac: new FormControl('', [Validators.required]),
    pais: new FormControl('', [Validators.required]),
    fotoPerfil: new FormControl(''),
  });

  base64Image: string = 'data:image/png;base64,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';
  paises: Array<PaisesModel> = []
  paisesFiltrados!: Array<PaisesModel>;


  ngOnInit() {
    this.#paisesService.getAllPaises().subscribe({
      next: (paises) => {
        this.paises = paises;
      },
      
      error: console.log
    });
    this.paisesFiltrados = this.paises;
  }

  // Esta función te envía al paso 2 del registro y te guarda los valores que hayas rellenado en este paso
  goToPaso2(){
    if(
      this.paso1RegForm.value.nombre == "" ||
      this.paso1RegForm.value.apellidos == "" ||
      this.paso1RegForm.value.nombreUsuario == "" ||
      this.paso1RegForm.value.correo == "" ||
      this.paso1RegForm.value.pais == "" ||
      this.paso1RegForm.value.fechaNac == ""
      ){
      console.log("Debe rellenar todos los campos para poder continuar con el registro");
    }else if(this.validarFecha(this.paso1RegForm.value.fechaNac.toString())){
      console.log('Formato de fecha inválido');
      
    }else{
      localStorage.setItem('regNombre', this.paso1RegForm.value.nombre);
      localStorage.setItem('regApellidos', this.paso1RegForm.value.apellidos);
      localStorage.setItem('regNombreUsuario', this.paso1RegForm.value.nombreUsuario);
      localStorage.setItem('regCorreo', this.paso1RegForm.value.correo);

      let paisUsuario = this.paises.find(pais => pais.nombre === this.paso1RegForm.value.pais);
      if(paisUsuario?.idPais != undefined){
        localStorage.setItem('regIdPais', paisUsuario?.idPais.toString());
      }
      localStorage.setItem('regFechaNac', this.paso1RegForm.value.fechaNac);
      localStorage.setItem('regImgPerfil', this.base64Image);

      this.#router.navigate(['reg/paso2']);
    }
  }

  // Esta función pasa la imagen que recoja del input a base64
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
              this.#snackBarService.openErrorSnackBar('El archivo seleccionado no es una imagen jpg o png');
            } else if ((fileReader.result as string).length > 4294967295 ) {   
              console.log('La imagen pesa más de 4GB animaaal');
              this.#snackBarService.openErrorSnackBar('La imagen pesa más de 4GB');
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

  // Esta clase filtra los nombres de los paises por la cadena que se le pase
  private _filter(value: string): PaisesModel[] {
    const filterValue = value.toLowerCase();
    return this.paises.filter((pais: PaisesModel) => pais.nombre.toLowerCase().includes(filterValue));
  }

  // Esta es la función que se ejecuta al pulsar una tecla en el input de búsqueda
  onKeyup($event: Event) {
    let eventTarget = $event.target as HTMLInputElement;
    this.paisesFiltrados = this._filter(eventTarget.value);
  }

  // Esta función te manda al home cuando cancelas el registro
  cancelRegister(){
    localStorage.clear();
    this.#router.navigate(['/home']);
  }

  // Esta función valida la fecha de nacimiento
  validarFecha(fecha: string) {
    const fechaDate = new Date(fecha);


    if (isNaN(fechaDate.getTime())) {
      return false;
    }

    const anio = fechaDate.getFullYear();
    const mes = fechaDate.getMonth() + 1;
    const dia = fechaDate.getDate();

    const anioActual = new Date().getFullYear();
    if (anio > anioActual || anio < 1900) {
      return true;
    }

    if (mes < 1 || mes > 12) {
      return true;
    }

    const diasEnEsteMes = new Date(anio, mes, 0).getDate();
    if (dia < 1 || dia > diasEnEsteMes) {
      return true;
    }

    return false;
  }
}
