import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ReproductorComponent } from './views/reproductor/reproductor/reproductor.component';
import { LoginComponent } from './views/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'enter', pathMatch: 'full' },
    { path: 'enter', component: LoginComponent },
    { path: 'play/:idCap', component: ReproductorComponent },

];
