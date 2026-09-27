import { Injectable, inject, signal } from '@angular/core';
import { RegistroService } from './registro.service';
import { IdiomaService } from './language.service';

export interface SesionInnova {
  nombre: string;
  correo: string;
  rol: string;
  createdAt: string;
}

const CLAVE_SESION = 'innova.sesion';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _abierto = signal(false);
  readonly abierto = this._abierto.asReadonly();

  private readonly _estado = signal<{
    texto: string;
    exitoso: boolean;
  } | null>(null);

  readonly estado = this._estado.asReadonly();

  private readonly _sesion = signal<SesionInnova | null>(
    this.cargarSesionInicial()
  );

  readonly sesion = this._sesion.asReadonly();

  private readonly registroService = inject(RegistroService);
  private readonly idiomas = inject(IdiomaService);

  private cargarSesionInicial(): SesionInnova | null {
    try {
      const crudo = localStorage.getItem(CLAVE_SESION);

      return crudo
        ? (JSON.parse(crudo) as SesionInnova)
        : null;
    } catch {
      return null;
    }
  }

  abrir(): void {
    this._estado.set(null);
    this._abierto.set(true);
  }

  cerrar(): void {
    this._abierto.set(false);
  }

  /**
   * Valida el correo y la contraseña contra los usuarios registrados.
   */
  iniciarSesion(correo: string, contrasena: string): void {
    const usuario = this.registroService.validarCredenciales(
      correo,
      contrasena
    );

    if (!usuario) {
      this._estado.set({
        texto: 'El correo o la contraseña son incorrectos.',
        exitoso: false
      });

      return;
    }

    const sesion: SesionInnova = {
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      createdAt: new Date().toISOString()
    };

    this.aplicarSesion(sesion);

    this._estado.set({
      texto: this.idiomas.t('auth.inicioSesionExito'),
      exitoso: true
    });

    setTimeout(() => {
      this.cerrar();
    }, 1500);
  }

  obtenerSesion(): SesionInnova | null {
    return this._sesion();
  }

  private aplicarSesion(sesion: SesionInnova | null): void {
    this.registroService.aplicarSesion(sesion);
    this._sesion.set(sesion);
  }

  cerrarSesion(): void {
    this.aplicarSesion(null);
  }
}