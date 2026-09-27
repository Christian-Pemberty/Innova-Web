import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

/**
 * Modelo de una noticia de Innova.
 * Refleja los campos de `public/noticias.json` y la estructura que se persiste en localStorage.
 */
export interface Noticia {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  esFavorito: boolean;
}

/** Estructura del JSON estático cargado desde `public/noticias.json`. */
interface NoticisPayload {
  noticias: Noticia[];
}

@Injectable({ providedIn: 'root' })
export class NoticiaService {
  /** Clave fija bajo la que el servicio persiste el estado en localStorage. */
  private static readonly STORAGE_KEY = 'innova:noticias';

  /** Estado reactivo de las noticias; los componentes pueden suscribirse a `noticias`. */
  private readonly _noticias = signal<Noticia[]>(this.leeAlmacenamiento());
  readonly noticias = this._noticias.asReadonly();

  /**
   * `true` mientras la carga inicial de `noticias.json` está en vuelo
   * (solo ocurre en la primera visita, cuando localStorage está vacío).
   */
  private readonly cargando = signal(this._noticias().length === 0);
  /** Señal de solo-lectura para el estado de carga inicial. */
  readonly estaCargando = this.cargando.asReadonly();

  constructor(private readonly http: HttpClient) {
    // Si localStorage está vacío (primera visita), siembra el estado con el JSON inicial.
    if (this._noticias().length === 0) {
      this.http.get<NoticisPayload>('noticias.json').subscribe({
        next: (payload) => {
          const lista = Array.isArray(payload?.noticias) ? payload.noticias : [];
          this.guardaAlmacenamiento(lista);
          this._noticias.set(lista);
        },
        error: (error) =>
          console.error('[Innova] No se pudo cargar noticias.json para inicializar el almacenamiento.', error),
        complete: () => this.cargando.set(false)
      });
    }
  }

  /** Devuelve la lista actual de noticias. */
  getNoticias(): Noticia[] {
    return this._noticias();
  }

  /**
   * Añade una noticia. Si no se proporciona `id`, se asigna el siguiente correlativo.
   * La lista resultante queda persistida en localStorage.
   */
  agregarNoticia(nueva: Omit<Noticia, 'id'> & Partial<Pick<Noticia, 'id'>>): Noticia {
    const lista = this._noticias();
    const noticia: Noticia = {
      ...nueva,
      id: nueva.id ?? this.siguienteId(lista)
    };
    const actualizada = [...lista, noticia];
    this.guardaAlmacenamiento(actualizada);
    this._noticias.set(actualizada);
    return noticia;
  }

  /** Cambia `esFavorito` de la noticia identificada por `id` y persiste el cambio. */
  toggleFavorito(id: number): void {
    const actualizada = this._noticias().map((n) =>
      n.id === id ? { ...n, esFavorito: !n.esFavorito } : n
    );
    this.guardaAlmacenamiento(actualizada);
    this._noticias.set(actualizada);
  }

  /** Actualiza los datos de una noticia existente y persiste el cambio. */
  actualizarNoticia(
    id: number,
    cambios: Partial<Omit<Noticia, 'id'>>
  ): Noticia | null {
    const lista = this._noticias();
    const indice = lista.findIndex((n) => n.id === id);

    if (indice === -1) {
      return null;
    }

    const actualizada = {
      ...lista[indice],
      ...cambios,
      id
    };

    const nuevaLista = [...lista];
    nuevaLista[indice] = actualizada;

    this.guardaAlmacenamiento(nuevaLista);
    this._noticias.set(nuevaLista);

    return actualizada;
  }
  
  /** Elimina la noticia identificada por `id` y persiste el cambio. */
  eliminarNoticia(id: number): void {
    const actualizada = this._noticias().filter((n) => n.id !== id);
    this.guardaAlmacenamiento(actualizada);
    this._noticias.set(actualizada);
  }

  /** Recupera las noticias guardadas en localStorage, o `[]` si no existen aún. */
  private leeAlmacenamiento(): Noticia[] {
    try {
      const crudo = localStorage.getItem(NoticiaService.STORAGE_KEY);
      if (!crudo) {
        return [];
      }
      const datos = JSON.parse(crudo) as Noticia[];
      return Array.isArray(datos) ? datos : [];
    } catch (error) {
      console.warn('[Innova] El almacenamiento local está corrupto; se ignorará.', error);
      return [];
    }
  }

  /** Persiste `noticias` en localStorage como JSON. */
  private guardaAlmacenamiento(noticias: Noticia[]): void {
    try {
      localStorage.setItem(NoticiaService.STORAGE_KEY, JSON.stringify(noticias));
    } catch (error) {
      console.warn('[Innova] No se pudo guardar en almacenamiento local (posible cuota excedida).', error);
    }
  }

  /** Calcula el siguiente `id` correlativo a partir de la lista actual. */
  private siguienteId(noticias: Noticia[]): number {
    return noticias.reduce((max, n) => Math.max(max, n.id), 0) + 1;
  }
}
