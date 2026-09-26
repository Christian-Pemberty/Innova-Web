import { Injectable, inject, signal } from '@angular/core';
import { RegistroService } from './registro.service';
import { IdiomaService } from './language.service';

/** Sesión básica simulada que se persiste en el navegador. */
export interface SesionInnova {
  nombre: string;
  correo: string;
  rol: string;
  /** Momento en que se creó la sesión (ISO 8601). */
  createdAt: string;
}

/** Clave bajo la que se guarda la sesión en localStorage. */
const CLAVE_SESION = 'innova.sesion';

/**
 * Servicio global que orquesta la apertura/cierre del modal de inicio de sesión
 * y expone la sesión activa. Comparte la misma clave de localStorage con RegistroService
 * para que el usuario pueda registrarse e iniciar sesión de forma transparente.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Estado reactivo: `true` cuando el modal debe mostrarse. */
  private readonly _abierto = signal(false);
  readonly abierto = this._abierto.asReadonly();

  /** Estado del mensaje en pantalla (error o éxito). */
  private readonly _estado = signal<{ texto: string; exitoso: boolean } | null>(null);
  readonly estado = this._estado.asReadonly();

  /** Sesión activa reactiva. */
  private readonly _sesion = signal<SesionInnova | null>(this.cargarSesionInicial());
  readonly sesion = this._sesion.asReadonly();

  /**
   * Servicio que expone la señal de sesión que lee la interfaz (navbar).
   * Al compartir la misma clave de localStorage, toda escritura debe
   * actualizarse en ambos lados para que la UI reaccione.
   */
  private readonly registroService = inject(RegistroService);

  /** Servicio de idiomas para las notificaciones en pantalla. */
  private readonly idiomas = inject(IdiomaService);

  /** Lee la sesión existente en localStorage en el arranque (o `null`). */
  private cargarSesionInicial(): SesionInnova | null {
    try {
      const crudo = localStorage.getItem(CLAVE_SESION);
      return crudo ? (JSON.parse(crudo) as SesionInnova) : null;
    } catch {
      return null;
    }
  }

  /** Abre el modal de inicio de sesión. */
  abrir(): void {
    this._abierto.set(true);
    this._estado.set(null);
  }

  /** Cierra el modal y limpia el estado. */
  cerrar(): void {
    this._abierto.set(false);
    this._estado.set(null);
  }

  /**
   * Inicia sesión: verifica credenciales contra la sesión guardada por RegistroService
   * o acepta cualquier dato válido (modo demo).
   *
   * @param correo - correo electrónico del usuario
   * @param contrasena - contraseña ingresada
   */
  iniciarSesion(correo: string, contrasena: string): void {
    // Consultamos la señal o, en su defecto, localStorage por si la sesión
    // se creó tras el arranque (p. ej. mediante RegistroService).
    const sesionExistente = this.obtenerSesion() ?? this.cargarSesionInicial();

    // Si el usuario se registró antes (sesión en localStorage), validamos contra eso.
    if (sesionExistente && sesionExistente.correo === correo.trim()) {
      // En producción, aquí verificarías la contraseña real con tu API.
      this.aplicarSesion(sesionExistente);
      this._estado.set({ texto: this.idiomas.t('auth.inicioSesionExito'), exitoso: true });

      setTimeout(() => {
        this.cerrar();
      }, 1500);
      return;
    }

    // Modo demo: acepta cualquier correo válido y contraseña.
    const sesionDemo: SesionInnova = {
      nombre: correo.split('@')[0],
      correo: correo.trim(),
      rol: 'Usuario',
      createdAt: new Date().toISOString(),
    };

    this.aplicarSesion(sesionDemo);
    this._estado.set({ texto: this.idiomas.t('auth.inicioSesionExito'), exitoso: true });

    setTimeout(() => {
      this.cerrar();
    }, 1500);
  }

  /** Devuelve la sesión activa o `null` si no hay ninguna. */
  obtenerSesion(): SesionInnova | null {
    return this._sesion();
  }

  /**
   * Persiste la sesión en localStorage y actualiza la señal propia y la de
   * RegistroService (la que lee la navbar), de modo que todo el UI reacciona
   * en la misma actualización.
   */
  private aplicarSesion(sesion: SesionInnova | null): void {
    this.registroService.aplicarSesion(sesion);
    this._sesion.set(sesion);
  }

  /** Elimina la sesión (logout). */
  cerrarSesion(): void {
    this.aplicarSesion(null);
  }
}
