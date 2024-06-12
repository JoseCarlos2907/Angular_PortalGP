import { Component, Input, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

import { environment } from '../../../environments/enviroment';


import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarraBusquedaComponent } from '../barra-busqueda/barra-busqueda.component';
import { Router } from '@angular/router';
import { PilotosService } from '../../services/pilotos.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HeaderSmComponent } from '../header-sm/header-sm.component';

@Component({
  selector: 'app-clasificacion-pilotos-comunidad',
  standalone: true,
  imports: [
    HeaderComponent,
    NgxChartsModule,
    BarraBusquedaComponent,
    HeaderSmComponent,
  ],
  templateUrl: './clasificacion-pilotos-comunidad.component.html',
  styleUrl: './clasificacion-pilotos-comunidad.component.css'
})
export class ClasificacionPilotosComunidadComponent {
  // Servicios del componente
  #router: Router = inject(Router);
  #pilotosService: PilotosService = inject(PilotosService);
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver)


  // Variables del componente
  datosClasificacion: any[] = [];

  tipo!: string | null;

  suscripcionRuta!: any;
  comprobanteAnchoPantalla: boolean = true;

  temaSeleccionado!: number;

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

    // Recogemos la informacion de los pilotos para la tabla de clasificación
    this.#pilotosService.getDatosClasificacionComunidad().subscribe(async (pilotos) => {
      this.datosClasificacion = [...pilotos];
    });
  }

  // Esta función se ejecuta cada vez que se muestra una escudería en la tabla, lo que hace es mostrar una imagen de bandera que se recoge de una API de terceros
  getImagenBandera(paisCC: string){
    return `${environment.urlCountryFlag}/${paisCC.toLowerCase()}.png`; 
  }

  // Esta función te redirige al perfil del piloto cuando clickas encima
  verPerfilPiloto(id: number){
    this.#router.navigate([`/perfil-piloto/${id}`])
  }
}
