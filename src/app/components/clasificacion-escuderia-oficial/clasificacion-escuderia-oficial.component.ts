import { Component, Input, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

import { environment } from '../../../environments/enviroment';


import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarraBusquedaComponent } from '../barra-busqueda/barra-busqueda.component';
import { EscuderiasService } from '../../services/escuderias.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HeaderSmComponent } from '../header-sm/header-sm.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clasificacion-escuderia-oficial',
  standalone: true,
  imports: [
    HeaderComponent,
    NgxChartsModule,
    BarraBusquedaComponent,
    HeaderSmComponent,
  ],
  templateUrl: './clasificacion-escuderia-oficial.component.html',
  styleUrl: './clasificacion-escuderia-oficial.component.css'
})
export class ClasificacionEscuderiaOficialComponent {

  // Servicios del componente
  #escuderiasService: EscuderiasService = inject(EscuderiasService);
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver)
  #router: Router = inject(Router);


  // Variables del componente
  datosClasificacion!: any[];
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

    // Recogemos la informacion de las escuderías para la tabla de clasificación
    this.#escuderiasService.getDatosClasificacionComunidad().subscribe(async (escuderia) => {
      this.datosClasificacion = [...escuderia];
      console.log(await escuderia);
    });
  }

  // Esta función se ejecuta cada vez que se muestra una escudería en la tabla, lo que hace es mostrar una imagen de bandera que se recoge de una API de terceros
  getImagenBandera(paisCC: string){
    return `${environment.urlCountryFlag}/${paisCC.toLowerCase()}.png`; 
  }


  // Esta función te redirige al perfil de la escuderia cuando clickas encima
  verPerfilEscuderia(id: number){
    this.#router.navigate([`/perfil-escuderia/${id}`])
  }
}
