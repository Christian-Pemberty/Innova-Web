import { Injectable, signal } from '@angular/core';

/** Datos capturados mediante el formulario de registro. */
export interface Registro {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
}

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
 * Servicio global que orquesta la apertura/cierre del modal de registro,
 * persiste una sesión simulada y expone la carga útil del último registro.
 */
@Injectable({ providedIn: 'root' })
export class RegistroService {
  /** Estado reactivo: `true` cuando el modal debe mostrarse. */
  private readonly _abierto = signal(false);
  readonly abierto = this._abierto.asReadonly();

  /** Datos del último registro exitoso (se reinician al cerrar). */
  private readonly _datos = signal<Registro | null>(null);
  readonly datos = this._datos.asReadonly();

  /**
   * Sesión activa reactiva: permite que cualquier componente (navbar,
   * etc.) reaccione al registrarse un usuario o cerrar la sesión.
   */
  private readonly _sesion = signal<SesionInnova | null>(this.cargarSesionInicial());
  readonly sesion = this._sesion.asReadonly();

  /** Lee la sesión existente en localStorage en el arranque (o `null`). */
  private cargarSesionInicial(): SesionInnova | null {
    try {
      const crudo = localStorage.getItem(CLAVE_SESION);
      return crudo ? (JSON.parse(crudo) as SesionInnova) : null;
    } catch {
      return null;
    }
  }

  /** Abre el modal de registro. */
  abrir(): void {
    this._abierto.set(true);
  }

  /** Cierra el modal y limpia los datos temporales. */
  cerrar(): void {
    this._abierto.set(false);
    this._datos.set(null);
  }

  /**
   * Registra al usuario: simula la operación guardando una sesión básica
   * en localStorage y cierra el modal automáticamente.
   */
  registrar(datos: Registro): void {
    const sesion = this.guardarSesion(datos);
    this._datos.set(datos);
    this.cerrar();
  }

  /**
   * Guarda una sesión simulada en localStorage y actualiza el estado
   * reactivo para que la interfaz reaccione (p. ej. la navbar).
   */
  private guardarSesion(datos: Registro): SesionInnova {
    const sesion: SesionInnova = {
      nombre: datos.nombre,
      correo: datos.correo,
      rol: datos.rol,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    this._sesion.set(sesion);
    return sesion;
  }

  /** Devuelve la sesión activa o `null` si no hay ninguna. */
  obtenerSesion(): SesionInnova | null {
    return this._sesion();
  }

  /** Elimina la sesión simulada (logout) y notifica a la interfaz. */
  cerrarSesion(): void {
    this.aplicarSesion(null);
  }

  /**
   * Aplica una sesión (o la elimina si es `null`) y la persiste en
   * localStorage, actualizando la señal reactiva que lee la interfaz
   * (navbar, etc.). Sostiene la coherencia entre AuthService y este
   * servicio que comparten la misma clave de localStorage.
   */
  aplicarSesion(sesion: SesionInnova | null): void {
    if (sesion) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
    this._sesion.set(sesion);
  }
}
