import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia, NoticiaService } from '../../noticia.service';
import { IdiomaService } from '../../language.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent {
  /** Inyecta el servicio de noticias para leer y mutar los favoritos de forma reactiva. */
  protected readonly service = inject(NoticiaService);

  /** Servicio de idiomas para el diálogo de confirmación de eliminación. */
  private readonly idiomas = inject(IdiomaService);

  readonly noticias = this.service.noticias;

  /** `true` solo durante la siembra inicial (primera visita, antes de que responda `noticias.json`). */
  readonly cargando = this.service.estaCargando;

  /** Lista derivada: solo las noticias marcadas como favoritas. */
  readonly favoritos = computed<Noticia[]>(() =>
    this.noticias().filter((n) => n.esFavorito)
  );

  /** Alterna el estado de favorito de una noticia; el cambio queda persistido por el servicio. */
  onDesFavoritar(id: number): void {
    this.service.toggleFavorito(id);
  }

  /** Elimina una noticia tras pedir confirmación al usuario. */
  onEliminar(id: number): void {
    const confirmar = window.confirm(this.idiomas.t('home.confirmarEliminar'));
    if (!confirmar) return;
    this.service.eliminarNoticia(id);
  }
}
