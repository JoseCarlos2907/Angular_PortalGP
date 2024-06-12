import { Component, Input, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

import { environment } from '../../../environments/enviroment';


import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarraBusquedaComponent } from '../barra-busqueda/barra-busqueda.component';
import { Router } from '@angular/router';
import { PilotosService } from '../../services/pilotos.service';
import { CarrerasService } from '../../services/carreras.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HeaderSmComponent } from '../header-sm/header-sm.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-clasificacion-pilotos-oficial',
  standalone: true,
  imports: [
    HeaderComponent,  
    NgxChartsModule,
    BarraBusquedaComponent,
    HeaderSmComponent,
    SkeletonModule,
  ],
  templateUrl: './clasificacion-pilotos-oficial.component.html',
  styleUrl: './clasificacion-pilotos-oficial.component.css'
})

export class ClasificacionPilotosOficialComponent {

  // Servicios del componente
  #router: Router = inject(Router);
  #pilotosService: PilotosService = inject(PilotosService);
  #carrerasService: CarrerasService = inject(CarrerasService);
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver)
  
  
  // Variables del componente
  datosClasificacion: any[] = [];
  fechas = [];
  suscripcionRuta!: any;
  
  // Datos del Diagrama
  multi: any = [];
  view: [number,number] = [1600, 600];
  comprobanteAnchoPantalla: boolean = true;
  temaSeleccionado!: number;

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fechas';
  yAxisLabel: string = 'Puntos';
  timeline: boolean = true;
  yAxisTicks: Array<number>=[0, 100, 200, 300, 400, 500, 600];
  yScaleMin: number = 0;
  yScaleMax: number = 640;

  async ngOnInit(){
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

    // Recogemos todas las fechas de la base de datos para ordenar los puntos posteriormente según estas fechas
    this.#carrerasService.getAllFechas().subscribe(async (fechas) => {
      this.fechas = await fechas;
      console.log('Fechas: ' + this.fechas);
    });

    // Recogemos los datos importantes de cada piloto para enseñarlos
    this.#pilotosService.getDatosClasificacionOficial().then(async (pilotos) => {
      this.datosClasificacion = [...pilotos];
      this.datosClasificacion.sort((a, b) => b.puntosTotales - a.puntosTotales);
      this.cargarDatosEnGrafica(this.datosClasificacion);
    });
    
    // Cargamos los datos en la gráfica
    Object.assign(this, this.multi);
  }

  // Esta función se ejecuta cada vez que se muestra una escudería en la tabla, lo que hace es mostrar una imagen de bandera que se recoge de una API de terceros
  getImagenBandera(paisCC: string){
    return `${environment.urlCountryFlag}/${paisCC.toLowerCase()}.png`; 
  }

  // La siguiente función lo que hace es transformar los datos recogidos al formato que la gráfica necesita para mostrarlos
  async cargarDatosEnGrafica(datosClasificacion: any[]){
    datosClasificacion.forEach((piloto) => {
      this.#pilotosService.getPuntuacionesPiloto(piloto.idPiloto).subscribe((punts) => {
        let series = [];
        let puntuacionesPiloto: number[] = [];
  
        // Pasamos de recoger los puntos conseguidos en cada carrera a un array con los puntos totales después de cada carrera
        for (let i = 0; i < punts.length; i++) {
          if(i==0){
            puntuacionesPiloto.push(parseInt(punts[i]));
          }else{
            puntuacionesPiloto.push(parseInt(punts[i]+puntuacionesPiloto[i-1]));
          }
        }

        // Hacemos el primer paso para transformarlo en el formato necesario, apuntando los datos de cada piloto por fecha y puntuación, en caso de que haya más fechas que carreras efectuadas, los puntos se asociarán a un valor de 0
        for(let i=0; i<this.fechas.length; i++){
          series.push({
            'name': this.fechas[i],
            'value': i > puntuacionesPiloto.length-1 ? 0 : puntuacionesPiloto[i]
          });
        }

        // Y después asociamos estos puntos por fecha al nombre del piloto que le toque en cada iteración
        this.multi.push({
          'name': piloto.apellido,
          'series': series.slice()
        });
      });
    });
  }

  // Esta función te redirige al perfil del piloto cuando clickas encima
  verPerfilPiloto(id: number){
    this.#router.navigate([`/perfil-piloto/${id}`])
  }
}