import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Noticia, NoticiaService } from '../../noticia.service';
import { map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IdiomaService } from '../../language.service';

@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './noticia-detalle.component.html',
  styleUrl: './noticia-detalle.component.css'
})
export class NoticiaDetalleComponent {
  /** Inyecta el servicio de noticias para leer y mutar la noticia de forma reactiva. */
  protected readonly service = inject(NoticiaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly idiomas = inject(IdiomaService);

  /**
   * Id de la noticia desde el parámetro `:id` de la URL, reactivo
   * ante navegación entre noticias (p. ej. clic en otra tarjeta).
   */
  private readonly idStr = toSignal(
    this.route.paramMap.pipe(
      map((pm) => pm.get('id')),
      takeUntilDestroyed()
    )
  );

  /**
   * Noticia referenciada por el `id` de la URL, reactiva ante
   * cambios de estado (p. ej. si se elimina). `null` si no existe.
   */
  readonly noticia = computed<Noticia | null>(() => {
    const idCrudo = this.idStr();
    const id = idCrudo ? Number(idCrudo) : NaN;
    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }
    return this.service.noticias().find((n) => n.id === id) ?? null;
  });

  /** Elimina la noticia y regresa al archivo completo. */
  onEliminar(): void {
    const noticia = this.noticia();
    if (!noticia) return;
    const confirmar = window.confirm(this.idiomas.t('home.confirmarEliminar'));
    if (!confirmar) return;
    this.service.eliminarNoticia(noticia.id);
    this.router.navigate(['/noticias']);
  }
}
