import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { BarraBusquedaComponent } from '../barra-busqueda/barra-busqueda.component';
import { HeaderSmComponent } from '../header-sm/header-sm.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { EscuderiasService } from '../../services/escuderias.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-escuderia',
  standalone: true,
  imports: [
    HeaderComponent, 
    BarraBusquedaComponent,
    HeaderSmComponent,

    MatGridListModule,
  ],
  templateUrl: './perfil-escuderia.component.html',
  styleUrl: './perfil-escuderia.component.css'
})
export class PerfilEscuderiaComponent {

  // Servicios del componente
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  #escuderiasService: EscuderiasService = inject(EscuderiasService);
  #actRoute: ActivatedRoute = inject(ActivatedRoute);


  // Variables del componente
  comprobanteAnchoPantalla: boolean = true;
  temaSeleccionado !: number;
  escuderia: any = {}
  idEscuderia!: number;
  imagenSeleccionada!: string;
  imagenEscuderia!: string;

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

    this.idEscuderia = this.#actRoute.snapshot.params['id'];
    this.#escuderiasService.getDatosPerfilEscuderia(this.idEscuderia).subscribe((response) => {
      this.escuderia = response;
      this.imagenSeleccionada = this.escuderia.imgPrincipal;
      this.imagenEscuderia = `background-image: url('${this.escuderia.imgEscuderia}');`;
      console.log(this.escuderia);
    });

    }
    
    
    // Esta imagen es la que se ejecuta al hacer click en una imagen
    seleccionarImagen(img: string){
      this.imagenSeleccionada = img;
    }
}
