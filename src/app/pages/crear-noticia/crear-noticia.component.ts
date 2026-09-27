import { Component, inject, signal, ApplicationRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NoticiaService } from '../../noticia.service';
import { IdiomaService } from '../../language.service';

@Component({
  selector: 'app-crear-noticia',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './crear-noticia.component.html',
  styleUrl: './crear-noticia.component.css'
})
export class CrearNoticiaComponent implements OnInit {
  ngOnInit(): void {
  this.cargarNoticiaParaEditar();
}
 
  /** Inyecta el servicio de noticias para persistir el nuevo borrador. */
  protected readonly service = inject(NoticiaService);

  /** Servicio de idiomas para las categorías y textos del editor. */
  protected readonly idiomas = inject(IdiomaService);

  /** En zonaless mode (Angular 21), tick() fuerza que la vista reaccione al signal.set(). */
  private readonly appRef = inject(ApplicationRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly editando = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  private cargarNoticiaParaEditar(): void {
  const idParam = this.route.snapshot.paramMap.get('id');

  if (!idParam) {
    return;
  }

  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    return;
  }

  const noticia = this.service.getNoticias().find((n) => n.id === id);

  if (!noticia) {
    this.router.navigate(['/noticias']);
    return;
  }

  this.editando.set(true);
  this.idEditando.set(id);

  this.titulo = noticia.titulo;
  this.selectedCategoria = noticia.categoria;
  this.descripcion = noticia.descripcion;
  this.imagenUrl = noticia.imagen;
  this.longitudDescripcion = noticia.descripcion.length;
}

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

  const datos = {
    titulo,
    categoria,
    descripcion: descripcion || 'Borrador publicado desde el editor de Innova.',
    imagen: imagenUrl || `https://picsum.photos/seed/innova-${Date.now()}/640/420`
  };

  const id = this.idEditando();

  if (this.editando() && id !== null) {
    const actualizada = this.service.actualizarNoticia(id, datos);

    if (!actualizada) {
      return;
    }

    this.publicada.set(actualizada.titulo);
  } else {
    const creada = this.service.agregarNoticia({
      ...datos,
      esFavorito: false
    });

    this.publicada.set(creada.titulo);
  }

  this.appRef.tick();

  if (this.avisoTimer) {
    clearTimeout(this.avisoTimer);
  }

  this.avisoTimer = setTimeout(() => {
    this.publicada.set(null);
    this.appRef.tick();
  }, 5000);
}
}
