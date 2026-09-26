import { Component, inject, signal, ApplicationRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoticiaService } from '../../noticia.service';
import { IdiomaService } from '../../language.service';

@Component({
  selector: 'app-crear-noticia',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './crear-noticia.component.html',
  styleUrl: './crear-noticia.component.css'
})
export class CrearNoticiaComponent {
  /** Inyecta el servicio de noticias para persistir el nuevo borrador. */
  protected readonly service = inject(NoticiaService);

  /** Servicio de idiomas para las categorías y textos del editor. */
  protected readonly idiomas = inject(IdiomaService);

  /** En zonaless mode (Angular 21), tick() fuerza que la vista reaccione al signal.set(). */
  private readonly appRef = inject(ApplicationRef);

  protected readonly categorias = [
    this.idiomas.t('filtro.educativas'),
    this.idiomas.t('filtro.tecnologicas'),
    this.idiomas.t('filtro.turisticas'),
    this.idiomas.t('filtro.comerciales')
  ];

  /** Valor del select cuando aún no se ha elegido categoría.
   *  Se usa cadena vacía PARA QUE la validación `required` del select sí sea
   *  efectiva (una string como '_placeholder_' nunca viola `required`). */
  protected selectedCategoria = '';

  /** Título de la noticia recién creada; se usa para confirmar la acción al usuario. */
  readonly publicada = signal<string | null>(null);

  /** Longitud actual de la descripción, para el contador en vivo. */
  protected longitudDescripcion = 0;

  /** Control bidireccional ngModel: título */
  protected titulo = '';

  /** Control bidireccional ngModel: imagen URL (valor inicial vacío) */
  protected imagenUrl = '';

  /** Control bidireccional ngModel: descripción del artículo */
  protected descripcion = '';

  private avisoTimer: ReturnType<typeof setTimeout> | undefined;

  /** Registra la longitud del texto para el contador en vivo. */
  onDescripcionChange(event: Event): void {
    const valor = (event.target as HTMLTextAreaElement).value ?? '';
    this.longitudDescripcion = valor.length;
  }

  /**
   * Envía el formulario: crea la noticia a través del servicio (persistida en
   * localStorage), resetea los campos y muestra una confirmación temporal.
   */
  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const titulo = (form.value.titulo ?? '').toString().trim();
    const categoria = (form.value.categoria ?? '').toString().trim();
    const descripcion = (form.value.descripcion ?? '').toString().trim();
    const imagenUrl = (form.value.imagen ?? '').toString().trim();

    const creada = this.service.agregarNoticia({
      titulo,
      categoria,
      descripcion: descripcion || 'Borrador publicado desde el editor de Innova.',
      imagen: imagenUrl || `https://picsum.photos/seed/innova-${Date.now()}/640/420`,
      esFavorito: false
    });

    // 1) Reset explícito del formulario con valores vacíos para que todos los controles vuelvan a un estado limpio (pristine + untouched).
   
    //    Esto evita edge cases en zoneless donde form.reset() sin argumentos puede dejar el formulario en estado mixto.
    form.reset({ titulo: '', categoria: this.categorias[0], descripcion: '', imagen: '' });
    this.longitudDescripcion = 0;

    // 2) Mostramos la confirmación AL FINAL del manejador de evento.
    //    En una app zoneless (Angular 21), el ciclo de detección no se ejecuta
    //    automáticamente después de un event handler; por eso usamos tick().
    this.publicada.set(creada.titulo);
    this.appRef.tick();

    // 3) Desaparece la confirmación por sí sola tras 5 segundos.
    //    Tick explícito también aquí: en modo zoneless, un signal.set() desde
    //    un timer no garantiza un ciclo de detección por sí solo.
    if (this.avisoTimer) clearTimeout(this.avisoTimer);
    this.avisoTimer = setTimeout(() => {
      this.publicada.set(null);
      this.appRef.tick();
    }, 5000);
  }
}
