import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BarraBusquedaComponent } from '../barra-busqueda/barra-busqueda.component';
import { HeaderSmComponent } from '../header-sm/header-sm.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { PilotosService } from '../../services/pilotos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { format, parse } from 'date-fns';
import { es, is } from 'date-fns/locale';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CarrerasService } from '../../services/carreras.service';
import { PilotosModel } from '../../models/pilotos.model';
import { CochesService } from '../../services/coches.service';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-perfil-piloto',
  standalone: true,
  imports: [
    HeaderComponent,
    BarraBusquedaComponent,
    HeaderSmComponent,
    NgxChartsModule,
  ],
  templateUrl: './perfil-piloto.component.html',
  styleUrl: './perfil-piloto.component.css'
})
export class PerfilPilotoComponent {
  
  // Servicios del componente
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  #pilotoService: PilotosService = inject(PilotosService);
  #usuariosService: UsuariosService = inject(UsuariosService);
  #actRoute: ActivatedRoute = inject(ActivatedRoute);
  #carrerasService: CarrerasService = inject(CarrerasService);
  #authService: AuthService = inject(AuthService);
  #router: Router = inject(Router);

  // Variables del componente
  comprobanteAnchoPantalla: boolean = true;
  temaSeleccionado!: number;
  idPiloto!: number;
  piloto!: PilotosModel;
  imagenCoche!: string;
  siguePiloto!: boolean;
  usuario: any = {}
  ultimosTiempos: any[] = []
  ultimasPosiciones: any[] = []

  // Datos del diagrama
  multi: any = [];
  fechas = [];

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
  view: [number,number] = [1600, 600];


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

    this.idPiloto = this.#actRoute.snapshot.params['id'];
    this.#pilotoService.getPilotoById(this.idPiloto).subscribe((piloto) => {
      this.piloto = piloto;
    });

    this.#pilotoService.getDatosPerfilPiloto(this.idPiloto).subscribe((result) => {
      this.usuario = result.datosBasicos;
      this.ultimosTiempos = result.ultimosTiempos;
      this.ultimasPosiciones = result.ultimasPosiciones;
    });

    this.#carrerasService.getAllFechas().subscribe(async (fechas) => {
      this.fechas = await fechas;
      console.log('Fechas: ' + this.fechas);
      this.cargarDatosEnGrafica();
    });

    this.#pilotoService.getCocheByIdPiloto(this.idPiloto).subscribe((coche) => {
      this.imagenCoche = `background-image: url(${coche.imgPrincipal});`;
    });

    let idUsuario = localStorage.getItem("idUsuario");
    if(idUsuario != null){
      this.#usuariosService.getPilotosSeguidosByIdUsuario(parseInt(idUsuario)).subscribe((pilotos: any[]) => {
        this.siguePiloto = pilotos.some(piloto => piloto.idPiloto == this.idPiloto);
      });
    }
  }
  
  async cargarDatosEnGrafica(){
    this.#pilotoService.getPuntuacionesPiloto(this.idPiloto).subscribe((punts) => {
      let series = [];
      let puntuacionesPiloto: number[] = [];

      for (let i = 0; i < punts.length; i++) {
        if(i==0){
          puntuacionesPiloto.push(parseInt(punts[i]));
        }else{
          puntuacionesPiloto.push(parseInt(punts[i]+puntuacionesPiloto[i-1]));
        }
      }

      for(let i=0; i<this.fechas.length; i++){
        series.push({
          'name': this.fechas[i],
          'value': i > puntuacionesPiloto.length-1 ? 0 : puntuacionesPiloto[i]
        });
      }

      this.multi.push({
        'name': this.piloto.apellido,
        'series': series.slice()
      });
    });
  }

  // Esta función te devuelve la fecha que se le pase con un formato concreto
  formatoFecha(fecha: string){
    if (!fecha) {
      return '';
    }
    
    const parsedDate = parse(fecha, 'dd/MM/yyyy', new Date());
    
    const formattedDate = format(parsedDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es });
    
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  // Esta función se ejecuta al hacer click en dejar de seguir un piloto
  dejarDeSeguir(){
    this.siguePiloto = false;

    let idSeguidor = localStorage.getItem('idUsuario');

    if(idSeguidor != null && this.idPiloto != undefined){
      this.#pilotoService.dejarDeSeguirPiloto(idSeguidor, this.idPiloto.toString()).subscribe((msg) => {
        console.log(msg);
      });
    }
  }

  // Esta función se ejecuta al hacer click en seguir un piloto
  async seguirPiloto(){
    
    let isVerified = await this.#authService.fbIsUserVerified();

    if(isVerified){
      this.siguePiloto = true;
  
      let idSeguidor = localStorage.getItem('idUsuario');
  
      if(idSeguidor != null && this.idPiloto != undefined){
        this.#pilotoService.seguirPiloto(idSeguidor, this.idPiloto.toString()).subscribe((msg) => {
          console.log(msg);
        });
      }
    }else{
      this.#router.navigate(['/reg/verificar-email']);
    }
  }
}
