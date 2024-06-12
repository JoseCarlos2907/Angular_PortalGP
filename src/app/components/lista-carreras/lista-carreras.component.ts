import { Component, HostListener, Input, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BarraBusquedaComponent } from '../barra-busqueda/barra-busqueda.component';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { HeaderSmComponent } from '../header-sm/header-sm.component';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { Router } from '@angular/router';
import { CarrerasService } from '../../services/carreras.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-carreras',
  standalone: true,
  imports: [
    HeaderComponent,
    BarraBusquedaComponent,
    HeaderSmComponent,
    CommonModule,
  ],
  templateUrl: './lista-carreras.component.html',
  styleUrl: './lista-carreras.component.css'
})
export class ListaCarrerasComponent {

  // Servicios del componente
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  #router: Router = inject(Router);
  #carrerasService: CarrerasService = inject(CarrerasService);
  #responsive: BreakpointObserver = inject(BreakpointObserver);

  // Variables del componente
  temaSeleccionado!: number;
  comprobanteAnchoPantalla: boolean = true;
  showGoUpButton: boolean = false;
  showScrollHeight = 1000;
  hideScrollHeight = 500;
  listaCarreras: any[] = []
  rutaIconoVolverArriba!: string;

  async ngOnInit(){
    // Recogemos el tema que tenga el usuario seleccionado para asociarlo al estilo de la página y si no está iniciado sesión se pone el predeterminado
    let tema = localStorage.getItem('temaSeleccionado');
    if(tema != null){
      this.temaSeleccionado = parseInt(tema);
    }else{
      this.temaSeleccionado = 0;
    }

    if(this.temaSeleccionado in [1,2]){
      this.rutaIconoVolverArriba = '../../../assets/images/IconoVolverArribaNegro.png';
    }else{
      this.rutaIconoVolverArriba = '../../../assets/images/IconoVolverArribaBlanco.png';
    }

    // Header segun ancho de pantalla
    this.#breakpointObserver.observe(['(max-width: 1025px)']).subscribe((state: BreakpointState) => {
      if(state.matches){
        this.comprobanteAnchoPantalla = true;
      }else{
        this.comprobanteAnchoPantalla = false;
      }
    });


    // Recogemos todas las carreras para motrarlas en el componente
    let response = await this.#carrerasService.getListaCarreras();
    
    
    if(response){
      this.listaCarreras = response
    }
    console.log(this.listaCarreras);

    // Por cada carrera se le asigna la fecha como cadena con el formato que le da dicha función y se le asigna una clase según el estado que tenga
    this.listaCarreras.forEach(carrera => {
      let fechaCadena = this.convertirFechaACadena(carrera.fecha, carrera.horaInicio);
      carrera.fechaCadena = fechaCadena;

      carrera.clase = this.asignarClase(carrera.estado);
      });
    console.log(this.listaCarreras);

    
  }


  // Esta función pasa de una cadena de una fecha con formato DD/MM/YYYY a una cadena con formato "Lunes 10 de Junio"
  convertirFechaACadena(fecha: string, hora: string): string{
    fecha = fecha.replaceAll('-','/');
    const fechaHora = `${fecha} ${hora}`;
    
    const parsedDate = parse(fechaHora, 'dd/MM/yyyy HH:mm', new Date());
    
    const formattedDate = format(parsedDate, 'EEEE d \'de\' MMMM', { locale: es });
    
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  // Según la cadena que se le pase le pone una u otra clase
  asignarClase(estado: string){
    switch (estado) {
      case 'Finalizada':
        return estado.toLowerCase();

      case 'En Proceso':
      case 'Por Correr':
        let arrayAux = estado.split(' ');
        return arrayAux[0].toLowerCase() + arrayAux[1];

      default:
        return 'Chungo si llega aqui'
    }
  }

  // Esta función te muestra un botón a cierto punto de profundidad para volver hacia arriba en la página
  @HostListener('window:scroll', [])
  onWindowScroll() {    
    if(window != null){
      if (( window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.documentElement.scrollTop) > this.showScrollHeight) { 
        this.showGoUpButton = true;
      } else if ( this.showGoUpButton &&
        (window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.documentElement.scrollTop)
        < this.hideScrollHeight) {  
        this.showGoUpButton = false;
      }
    }
  }

  // Esta función te manda arriba de la página directamente
  scrollTop() {
    document.documentElement.scrollTop = 0;
  }

  // Esta función es la que te manda a ver los detalles de una carrera
  verDetallesCarrera(id: number){
    this.#router.navigate([`/carrera/${id}`]);
  }
}
