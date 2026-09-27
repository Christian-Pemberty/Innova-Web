import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(
        (mod) => mod.HomeComponent
      ),
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./pages/favoritos/favoritos.component').then(
        (mod) => mod.FavoritosComponent
      ),
  },
  {
    path: 'crear-noticia',
    loadComponent: () =>
      import('./pages/crear-noticia/crear-noticia.component').then(
        (mod) => mod.CrearNoticiaComponent
      ),
  },
  {
    path: 'noticias',
    loadComponent: () =>
      import('./pages/noticias/noticias.component').then(
        (mod) => mod.NoticiasComponent
      ),
  },
  {
    path: 'noticias/editar/:id',
    loadComponent: () =>
      import('./pages/crear-noticia/crear-noticia.component').then(
        (mod) => mod.CrearNoticiaComponent
      ),
  },
  {
    path: 'noticias/:id',
    loadComponent: () =>
      import('./pages/noticia-detalle/noticia-detalle.component').then(
        (mod) => mod.NoticiaDetalleComponent
      ),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto.component').then(
        (mod) => mod.ContactoComponent
      ),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(
        (mod) => mod.RegistroComponent
      ),
  },
  {
    path: 'iniciar-sesion',
    loadComponent: () =>
      import('./pages/iniciar-sesion/iniciar-sesion.component').then(
        (mod) => mod.IniciarSesionComponent
      ),
  },
  { path: '**', redirectTo: '' }
];
