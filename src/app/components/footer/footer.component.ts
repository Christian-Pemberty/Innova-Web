import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IdiomaService } from '../../language.service';

interface EnlaceExplorar {
  etiqueta: string;
  ruta: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  /** Servicio de idiomas; traduce la marca, columnas y pie de página en vivo. */
  protected readonly idiomas = inject(IdiomaService);

  /** Año formateado como cadena para la plantilla zoneless (evita global `String` intranponible). */
  protected readonly anioStr = new Date().getFullYear().toString();

  /** Enlaces de la columna "Explorar" (etiquetas reactivas al idioma). */
  readonly enlacesExplorar = computed<EnlaceExplorar[]>(() => [
    { etiqueta: this.idiomas.t('nav.inicio'), ruta: '/' },
    { etiqueta: this.idiomas.t('home.noticiasDestacadas'), ruta: '/noticias' },
    { etiqueta: this.idiomas.t('nav.favoritos'), ruta: '/favoritos' },
    { etiqueta: this.idiomas.t('nav.contacto'), ruta: '/contacto' }
  ]);

  /** Año actual para la línea de copyright. */
  readonly anio = new Date().getFullYear();
}
