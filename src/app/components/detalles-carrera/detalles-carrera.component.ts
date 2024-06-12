import { Component, Input, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BarraBusquedaComponent } from '../barra-busqueda/barra-busqueda.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HeaderSmComponent } from '../header-sm/header-sm.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ResultadosCarrerasService } from '../../services/resultados-carreras.service';
import { ActivatedRoute } from '@angular/router';
import { CarrerasService } from '../../services/carreras.service';
import { CarrerasModel } from '../../models/carreras.model';
import { ResultadosClasificacionesService } from '../../services/resultados-clasificaciones.service';
import { ResultadosLibresService } from '../../services/resultados-libres.service';
import { CircuitosService } from '../../services/circuitos.service';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { MatDialog } from '@angular/material/dialog';
import { ModalComentarioComponent } from '../modal-comentario/modal-comentario.component';

@Component({
  selector: 'app-detalles-carrera',
  standalone: true,
  imports: [
    HeaderComponent,
    BarraBusquedaComponent,
    HeaderSmComponent,

    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './detalles-carrera.component.html',
  styleUrl: './detalles-carrera.component.css'
})
export class DetallesCarreraComponent {

  // Servicios del componente
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  #carrerasService: CarrerasService = inject(CarrerasService);
  #resultadosCarrerasService: ResultadosCarrerasService = inject(ResultadosCarrerasService);
  #resultadosClasificacionesService: ResultadosClasificacionesService = inject(ResultadosClasificacionesService);
  #resultadosLibresService: ResultadosLibresService = inject(ResultadosLibresService);
  #circuitosService: CircuitosService = inject(CircuitosService);
  #actRoute: ActivatedRoute = inject(ActivatedRoute);
  #dialog: MatDialog = inject(MatDialog);

  // Variables del componente
  carrera!: CarrerasModel;
  haComentado!: boolean;
  nombrePais!: string;
  imagenCircuito!: string;
  temaSeleccionado!: number;
  comprobanteAnchoPantalla: boolean = true;
  pos: number = 0;
  
  comentarios: any = []; 
  datosCarrera: any = {};
  datosClasificacion: any = {};
  datosLibres: any = [];

  ngOnInit(){
    // Se asigna el scroll a 0 para que cada vez que se entre a esta página esté situado arriba del todo
    document.documentElement.scrollTop = 0;

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

    // Recogemos los datos de la carrera mediante su id
    let idCarrera = this.#actRoute.snapshot.params['id'];
    this.#carrerasService.getCarreraById(idCarrera).subscribe((carrera) => {
      this.carrera = carrera;

      // Recogemos los datos el circuito mediante el id de la carrera y por el id de esta carrera recogemos el pais del circuito para finalmente obtener el nombre del pais y la imagen del circuito para ponerla de fondo en un div
      this.#carrerasService.getCircuitoByIdCarrera(this.carrera.idCarrera).subscribe((circuito) => {
        this.#circuitosService.getPaisByIdCircuito(circuito.idCircuito).subscribe((pais) => {
          this.nombrePais = pais.nombre;
          this.imagenCircuito = `background-image: url("${circuito.imgCircuito}");`;
        });
      });

      // Recogemos los resultados del top 3 en la clasificación mediante el id de la carrera
      this.#resultadosClasificacionesService.getTopPilotos(this.carrera.idCarrera).subscribe((result) => {
        this.datosClasificacion = result;
      });

      // Recogemos los resultados del top 3 de pilotos en la carrera mediante el id de la carrera
      this.#resultadosCarrerasService.getTopPilotos(this.carrera.idCarrera).subscribe((result) => {
        this.datosCarrera = result;
      });
      
      // Recogemos los resultados del top 3 de pilotos en los libres mediante el id de la carrera
      this.#resultadosLibresService.getTopPilotos(this.carrera.idCarrera).subscribe((result) => {
        this.datosLibres = result;
      });
    });

    // Recogemos los comentarios para mostarlos 
    this.#carrerasService.getComentariosCarreraByIdCarrera(idCarrera).subscribe((comentarios) => {
      this.comentarios = comentarios;
      console.log(comentarios);
      
      let idUsuario = localStorage.getItem('idUsuario');
      let comentariosUsuario = this.comentarios.filter((comentario: any) => comentario.idUsuario == idUsuario && comentario.idCarrera == idCarrera)
      if(comentariosUsuario.length == 0){
        this.haComentado = false;
      }else{
        this.haComentado = true;
      }
    });
  }

  // Esta función sirve para iterar sobre los libres añadiéndole uno al índice
  libreSiguiente(){
    if((this.pos+1) >=this.datosLibres.length){
      this.pos = 0;
    }else{
      this.pos++;
    }
  }

  // Esta función sirve para iterar sobre los libres restándole uno al índice
  libreAnterior(){
    if((this.pos-1) < 0){
      this.pos = this.datosLibres.length-1;
    }else{
      this.pos--;
    }
  }

  // Esta función pasa de una cadena de una fecha con formato DD/MM/YYYY a una cadena con formato "Lunes 10 de Junio"
  convertirFechaACadena(fecha: string, hora: string): string{
    fecha = fecha.replaceAll('-','/');
    const fechaHora = `${fecha} ${hora}`;
    
    const parsedDate = parse(fechaHora, 'dd/MM/yyyy HH:mm', new Date());
    
    const formattedDate = format(parsedDate, 'EEEE d \'de\' MMMM', { locale: es });
    
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  // Esta función es la que abre el modal para comentar
  abrirModalComentar(){
    sessionStorage.setItem('idDetalleCarrera',this.carrera.idCarrera.toString())
    this.#dialog.open(ModalComentarioComponent);
  }
}
