import { Routes } from '@angular/router';
import { TareasComponent } from './components/tareas.component';

export const routes: Routes = [
  { path: '', component: TareasComponent },
  { path: 'tareas', component: TareasComponent }
];
