import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { CarrerasService } from '../../services/carreras.service';
import { ActivatedRoute } from '@angular/router';
import { PilotosService } from '../../services/pilotos.service';
import { PilotosModel } from '../../models/pilotos.model';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-modal-comentario',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './modal-comentario.component.html',
  styleUrl: './modal-comentario.component.css'
})
export class ModalComentarioComponent {

  // Servicios del componente
  #dialog: MatDialog = inject(MatDialog);
  #carrerasService: CarrerasService = inject(CarrerasService);
  #pilotosService: PilotosService = inject(PilotosService);
  #snacBarService: SnackBarService = inject(SnackBarService);

  // Variables del componente
  pilotos: PilotosModel[] = [];
  idUsuario!: number

  formComentario: FormGroup = new FormGroup({
    idPiloto: new FormControl('', Validators.required),
    comentario: new FormControl('', Validators.required)
  });

  ngOnInit(){
    let idU = localStorage.getItem('idUsuario');
    if(idU != null){
      this.idUsuario = parseInt(idU);
    }

    this.#pilotosService.getAllPilotos().subscribe((pilotos) => {
      this.pilotos = pilotos;
    })
  }
  
  // Esta función cierra todos los modales
  cerrarModal(){
    this.#dialog.closeAll();
  }
  

  // Esta es la función que se ejecuta al confirmar el comentario
  comentar(){
    let idCarrera = sessionStorage.getItem('idDetalleCarrera');

    if(this.formComentario.value.comentario.length > 600){
      console.log('Ha excedido el máximo de caracteres del comentario');
      this.#snacBarService.openErrorSnackBar('Ha excedido el máximo de caracteres del comentario');
      return;
    }

    let data = `{
      "idUsuario": ${this.idUsuario},
      "idCarrera": ${idCarrera},
      "idPiloto": ${this.formComentario.value.idPiloto},
      "comentario": "${this.formComentario.value.comentario}"
    }`

    if(idCarrera != null){
      this.#carrerasService.comentarEnCarrera(parseInt(idCarrera), data).subscribe((msg) => {
        console.log(msg);
        this.#snacBarService.openSuccessSnackBar(msg);
        this.#dialog.closeAll();
      });
    }
  }
}
