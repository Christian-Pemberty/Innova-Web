import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiaService } from '../../noticia.service';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { IdiomaService } from '../../language.service';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [RouterLink, NewsCardComponent],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent {
  /** Inyecta el servicio de noticias para leer y mutar el archivo de forma reactiva. */
  protected readonly service = inject(NoticiaService);

  /** Servicio de idiomas para el diálogo de confirmación de eliminación. */
  private readonly idiomas = inject(IdiomaService);

  readonly noticias = this.service.noticias;

  /** `true` solo durante la siembra inicial (primera visita, antes de que responda `noticias.json`). */
  readonly cargando = this.service.estaCargando;

  /** Elimina una noticia tras pedir confirmación al usuario. */
  onEliminar(id: number): void {
    const confirmar = window.confirm(this.idiomas.t('home.confirmarEliminar'));
    if (!confirmar) return;
    this.service.eliminarNoticia(id);
  }
}
