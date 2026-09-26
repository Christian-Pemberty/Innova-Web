import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClaveTraduccion, IdiomaService } from '../../language.service';
import { Noticia } from '../../noticia.service';

@Component({
  selector: 'app-news-card',
  imports: [RouterLink],
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent {
  /** Noticia que se muestra en la tarjeta. */
  @Input() noticia!: Noticia;

  /** Servicio de idiomas (inyectado en contexto de inyección). */
  private readonly idiomas = inject(IdiomaService);

  /** Helper expuesto a la plantilla: traduce `clave` en vivo al cambiar ES/EN. */
  protected readonly t = (clave: ClaveTraduccion): string => this.idiomas.t(clave);

  /**
   * Se emite con el `id` de la noticia cuando el usuario pulsa el corazón.
   * El padre normalmente llama a `NoticiaService.toggleFavorito(id)`.
   */
  @Output() toggleFavorito = new EventEmitter<number>();

  /**
   * Se emite con el `id` de la noticia cuando el usuario pulsa la papelera.
   * El padre normalmente llama a `NoticiaService.eliminarNoticia(id)`.
   */
  @Output() eliminar = new EventEmitter<number>();

  /** Alterna el estado visual de favorito y notifica al padre (quien maneja la mutación). */
  onToggleFavorito(): void {
    this.toggleFavorito.emit(this.noticia.id);
  }

  /** Notifica al padre que se debe eliminar esta noticia. */
  onDelete(): void {
    this.eliminar.emit(this.noticia.id);
  }

  /** Ruta del detalle de la noticia. */
  rutaDetalle(): string {
    return `/noticias/${this.noticia.id}`;
  }
}
