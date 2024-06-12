import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListaCarrerasComponent } from './components/lista-carreras/lista-carreras.component';
import { PerfilPilotoComponent } from './components/perfil-piloto/perfil-piloto.component';
import { PerfilEscuderiaComponent } from './components/perfil-escuderia/perfil-escuderia.component';
import { DetallesCarreraComponent } from './components/detalles-carrera/detalles-carrera.component';
import { AjenoComponent } from './components/perfilUsuario/ajeno/ajeno.component';
import { PropioComponent } from './components/perfilUsuario/propio/propio.component';
import { ConfCuentaComponent } from './components/conf-cuenta/conf-cuenta.component';
import { Paso1Component } from './components/registro/paso1/paso1.component';
import { Paso2Component } from './components/registro/paso2/paso2.component';
import { SeguirPilotosComponent } from './components/registro/seguir-pilotos/seguir-pilotos.component';
import { VerificarEmailComponent } from './components/registro/verificar-email/verificar-email.component';
import { ClasificacionPilotosOficialComponent } from './components/clasificacion-pilotos-oficial/clasificacion-pilotos-oficial.component';
import { ClasificacionPilotosComunidadComponent } from './components/clasificacion-pilotos-comunidad/clasificacion-pilotos-comunidad.component';
import { ClasificacionEscuderiaOficialComponent } from './components/clasificacion-escuderia-oficial/clasificacion-escuderia-oficial.component';

export const routes: Routes = [
    {path:'home', component: HomeComponent},
    {path:'home/:reg', component: HomeComponent},
    {path:'lista-carreras', component: ListaCarrerasComponent},
    {path:'carrera/:id', component: DetallesCarreraComponent},
    {path:'clasificacion-pilotos-oficial', component: ClasificacionPilotosOficialComponent},
    {path:'clasificacion-pilotos-comunidad', component: ClasificacionPilotosComunidadComponent},
    {path:'clasificacion-escuderias-oficial', component: ClasificacionEscuderiaOficialComponent},
    {path:'perfil-piloto/:id', component: PerfilPilotoComponent},
    {path:'perfil-escuderia/:id', component: PerfilEscuderiaComponent},
    {path:'conf-cuenta/:id', component: ConfCuentaComponent},
    {path:'usuario-ajeno/:id', component: AjenoComponent},
    {path:'usuario-propio/:id', component: PropioComponent},
    {path:'reg/paso1', component: Paso1Component},
    {path:'reg/paso2', component: Paso2Component},
    {path:'reg/verificar-email', component: VerificarEmailComponent},
    {path:'reg/seguir-pilotos', component: SeguirPilotosComponent},
    {path:'', redirectTo: 'home', pathMatch:'full'},
    {path:'**', redirectTo: 'home', pathMatch:'full'},
];

