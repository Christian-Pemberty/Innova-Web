import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Noticia, NoticiaService } from '../../noticia.service';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { IdiomaService } from '../../language.service';
import { LucideGlobe } from '@lucide/angular';

interface Filtro {
  etiqueta: string;
  clave: string;
  icono: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, NewsCardComponent, LucideGlobe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  /** Inyecta el servicio de noticias para lectura y mutación reactiva. */
  protected readonly service = inject(NoticiaService);

  /** Servicio de idiomas; traduce el Hero, filtros, botones y secciones en vivo. */
  readonly idiomas = inject(IdiomaService);

  /** Categoría actualmente seleccionada: empieza con el valor dummy para mostrar el placeholder. */
  protected selectedCategoria = '_placeholder_';

  readonly noticias = this.service.noticias;

  /** `true` solo durante la siembra inicial (primera visita, antes de que responda `noticias.json`). */
  readonly cargando = this.service.estaCargando;

  readonly filtros = computed<Filtro[]>(() => [
    { etiqueta: this.idiomas.t('filtro.todas'), clave: 'todas', icono: 'bi bi-grid-3x3-gap' },
    { etiqueta: this.idiomas.t('filtro.educativas'), clave: 'educativas', icono: 'bi bi-mortarboard-fill' },
    { etiqueta: this.idiomas.t('filtro.tecnologicas'), clave: 'tecnologicas', icono: 'bi bi-cpu' },
    { etiqueta: this.idiomas.t('filtro.turisticas'), clave: 'turisticas', icono: 'bi bi-compass' },
    { etiqueta: this.idiomas.t('filtro.comerciales'), clave: 'comerciales', icono: 'bi bi-cart-fill' }
  ]);

  readonly filtroActivo = signal<string>('todas');

  readonly noticiasFiltradas = computed(() => {
    const clave = this.filtroActivo();
    if (clave === 'todas') return this.noticias();
    return this.noticias().filter(
      (n) => n.categoria.toLowerCase() === clave
    );
  });

  setFiltro(clave: string): void {
    this.filtroActivo.set(clave);
  }

  esFiltroActivo(clave: string): boolean {
    return this.filtroActivo() === clave;
  }

  /** Título del último borrador creado; se usa para confirmar la acción al usuario. */
  readonly publicada = signal<string | null>(null);

  private avisoTimer: ReturnType<typeof setTimeout> | undefined;

  /**
   * Envía el formulario del redactor rápido: crea la noticia a través del
   * servicio (persistida en localStorage), resetea los campos y muestra una
   * confirmación temporal. La vista se refresca en vivo gracias a la señal `noticias`.
   */
  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const titulo = (form.value.ctaTitulo ?? '').toString().trim();
    const categoria = (form.value.ctaCategoria ?? '').toString().trim();
    const descripcion = (form.value.ctaDescripcion ?? '').toString().trim();

    const creada = this.service.agregarNoticia({
      titulo,
      categoria,
      descripcion: descripcion || this.idiomas.t('crear.borradorDefault'),
      imagen: `https://picsum.photos/seed/innova-${Date.now()}/640/420`,
      esFavorito: false
    });

    // Si el filtro activo ocultaría la noticia recién creada, la ponemos a la vista.
    if (this.filtroActivo() !== 'todas' && this.filtroActivo() !== categoria.toLowerCase()) {
      this.filtroActivo.set(categoria.toLowerCase());
    }

    // Deferimos el reset al próximo macro-task para que Angular lo procese
    // después de la confirmación y muestre correctamente el placeholder.
    setTimeout(() => {
      form.reset();
      this.selectedCategoria = '_placeholder_';
    }, 0);

    // Confirmación temporal que se disipa sola.
    this.publicada.set(creada.titulo);
    if (this.avisoTimer) clearTimeout(this.avisoTimer);
    this.avisoTimer = setTimeout(() => this.publicada.set(null), 4000);
  }

  /** Elimina una noticia tras pedir confirmación al usuario. */
  onEliminar(id: number): void {
    const confirmar = window.confirm(this.idiomas.t('home.confirmarEliminar'));
    if (!confirmar) return;
    this.service.eliminarNoticia(id);
  }
}
