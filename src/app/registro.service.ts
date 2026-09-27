import { Injectable, signal } from '@angular/core';

export interface Registro {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
}

export interface UsuarioInnova {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
}

export interface SesionInnova {
  nombre: string;
  correo: string;
  rol: string;
  createdAt: string;
}

const CLAVE_USUARIOS = 'innova.usuarios';
const CLAVE_SESION = 'innova.sesion';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private readonly _abierto = signal(false);
  readonly abierto = this._abierto.asReadonly();

  private readonly _datos = signal<Registro | null>(null);
  readonly datos = this._datos.asReadonly();

  private readonly _sesion = signal<SesionInnova | null>(
    this.cargarSesionInicial()
  );
  readonly sesion = this._sesion.asReadonly();

  abrir(): void {
    this._abierto.set(true);
  }

  cerrar(): void {
    this._abierto.set(false);
    this._datos.set(null);
  }

  /**
   * Registra un nuevo usuario.
   * Retorna false si el correo ya está registrado.
   */
  registrar(datos: Registro): boolean {
    const usuarios = this.obtenerUsuarios();

    const correo = datos.correo.trim().toLowerCase();

    const existe = usuarios.some(
      (usuario) => usuario.correo.toLowerCase() === correo
    );

    if (existe) {
      return false;
    }

    const nuevoUsuario: UsuarioInnova = {
      nombre: datos.nombre.trim(),
      correo,
      contrasena: datos.contrasena,
      rol: datos.rol.trim()
    };

    usuarios.push(nuevoUsuario);

    this.guardarUsuarios(usuarios);

    const sesion = this.guardarSesion(nuevoUsuario);

    this._datos.set(datos);
    this._sesion.set(sesion);

    this.cerrar();

    return true;
  }

  /**
   * Busca un usuario por correo y contraseña.
   */
  validarCredenciales(
    correo: string,
    contrasena: string
  ): UsuarioInnova | null {
    const usuarios = this.obtenerUsuarios();

    const correoNormalizado = correo.trim().toLowerCase();

    return (
      usuarios.find(
        (usuario) =>
          usuario.correo.toLowerCase() === correoNormalizado &&
          usuario.contrasena === contrasena
      ) ?? null
    );
  }

  /**
   * Obtiene todos los usuarios almacenados localmente.
   */
  obtenerUsuarios(): UsuarioInnova[] {
    try {
      const crudo = localStorage.getItem(CLAVE_USUARIOS);

      if (!crudo) {
        return [];
      }

      const usuarios = JSON.parse(crudo);

      return Array.isArray(usuarios) ? usuarios : [];
    } catch {
      return [];
    }
  }

  private guardarUsuarios(usuarios: UsuarioInnova[]): void {
    localStorage.setItem(
      CLAVE_USUARIOS,
      JSON.stringify(usuarios)
    );
  }

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

  private guardarSesion(
    datos: UsuarioInnova
  ): SesionInnova {
    const sesion: SesionInnova = {
      nombre: datos.nombre,
      correo: datos.correo,
      rol: datos.rol,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify(sesion)
    );

    this._sesion.set(sesion);

    return sesion;
  }

  obtenerSesion(): SesionInnova | null {
    return this._sesion();
  }

  cerrarSesion(): void {
    this.aplicarSesion(null);
  }

  aplicarSesion(sesion: SesionInnova | null): void {
    if (sesion) {
      localStorage.setItem(
        CLAVE_SESION,
        JSON.stringify(sesion)
      );
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }

    this._sesion.set(sesion);
  }
}