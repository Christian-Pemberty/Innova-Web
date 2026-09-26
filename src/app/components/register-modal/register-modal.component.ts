import { Component, HostListener, ApplicationRef, inject, effect, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Registro, RegistroService } from '../../registro.service';
import { IdiomaService } from '../../language.service';

/**
 * Modal de registro de Innova (Bootstrap 5, componente standalone).
 *
 * Se controla globalmente a través de {@link RegistroService}:
 * - Se muestra cuando `registroService.abierto()` es `true`.
 * - Se cierra al pulsar "Cerrar", la X, la tecla Escape o el fondo.
 * - Al crear la cuenta se valida con ReactiveFormsModule, se guarda una
 *   sesión simulada en localStorage y el modal se cierra automáticamente.
 */
@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css'
})
export class RegisterModalComponent {
  /** Servicio global que orquesta apertura/cierre y persiste la sesión. */
  private readonly registro = inject(RegistroService);

  /** Servicio de idiomas para las validaciones y mensajes de error. */
  private readonly idiomas = inject(IdiomaService);

  /** Factory de Formularios Reactivos. */
  private readonly fb = inject(FormBuilder);

  /** Estado reactivo que el padre controla a través del servicio. */
  protected readonly abierto = this.registro.abierto;

  /** Intereses prioritarios disponibles (coinciden con las categorías del portal). */
  readonly roles = ['Educación', 'Tecnología', 'Turismo', 'Comercio'];

  /** `true` mientras se "envía" el registro (simula latencia de red). */
  protected readonly enviando = signal(false);

  /** Alterna la visibilidad de la contraseña. */
  protected readonly mostrarClave = signal(false);

  /**
   * Formulario reactivo con validación de campos:
   * - nombre: obligatorio, 2–80 caracteres.
   * - correo: obligatorio y con formato de e-mail válido.
   * - contrasena: obligatoria, 8–120 caracteres, debe combinar letras y números.
   * - rol: obligatorio.
   */
  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    contrasena: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(120),
      RegisterModalComponent.validarLetrasYNumeros
    ]],
    rol: ['', [Validators.required]]
  });

  /** Validador propio: la contraseña debe contener al menos una letra y un número. */
  static validarLetrasYNumeros(control: AbstractControl): ValidationErrors | null {
    const valor = (control.value ?? '').toString();
    const tieneLetra = /[a-záéíóúüñ]/i.test(valor);
    const tieneNumero = /\d/.test(valor);
    return tieneLetra && tieneNumero ? null : { contrasenaDebil: true };
  }

  /** Fuerza los ciclos de detección en una app zoneless (Angular 21). */
  private readonly appRef = inject(ApplicationRef);

  constructor() {
    // Bloquea el scroll del body mientras el modal está abierto (clase de Bootstrap).
    effect(() => {
      document.body.classList.toggle('modal-open', this.registro.abierto());
    });
  }

  /** Cierra el modal avisando al servicio que controle la apertura. */
  cerrar(): void {
    this.form.reset();
    this.mostrarClave.set(false);
    this.appRef.tick();
    this.registro.cerrar();
  }

  /** Cierra solo si el clic ocurrió sobre el fondo (área externa al diálogo). */
  onOverlayClick(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) {
      this.cerrar();
    }
  }

  /** Muestra / oculta la contraseña. */
  toggleClave(): void {
    this.mostrarClave.update(v => !v);
  }

  /** Indica si un campo ya debe mostrar su mensaje de error. */
  protected errorDe(nombre: string): boolean {
    const control = this.form.get(nombre);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Devuelve el mensaje de error correspondiente al primer error presente. */
  protected mensajeError(nombre: string): string {
    const control = this.form.get(nombre);
    if (!control || !control.invalid) {
      return '';
    }

    const errores = control.errors ?? {};
    if (errores['email']) {
      return this.idiomas.t('auth.correoInvalido');
    }
    if (errores['minLength']) {
      return nombre === 'nombre'
        ? this.idiomas.t('auth.nombreMinimo')
        : this.idiomas.tConParametros('auth.caracteresMinimos', { longitud: String(errores['requiredLength']) });
    }
    if (errores['contrasenaDebil']) {
      return this.idiomas.t('auth.contrasenaDebil');
    }
    if (errores['required']) {
      return this.idiomas.t('auth.campoRequerido');
    }
    return '';
  }

  /**
   * Envía el formulario: si es válido, simula la operación de red,
   * delega en el servicio (que persiste la sesión en localStorage) y
   * el modal se cierra automáticamente.
   */
  onSubmit(): void {
    if (this.enviando()) {
      return;
    }

    // Marca todos los campos como tocados para mostrar los mensajes de error.
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.appRef.tick();
      return;
    }

    const valores = this.form.getRawValue();
    const datos: Registro = {
      nombre: (valores.nombre ?? '').toString().trim(),
      correo: (valores.correo ?? '').toString().trim(),
      contrasena: (valores.contrasena ?? '').toString(),
      rol: (valores.rol ?? '').toString().trim()
    };

    this.enviando.set(true);
    this.appRef.tick();

    // Simula la latencia de una API real antes de "guardar" la sesión.
    setTimeout(() => {
      // Guarda la sesión en localStorage y cierra el modal automáticamente.
      this.registro.registrar(datos);
      this.form.reset();
      this.mostrarClave.set(false);
      this.enviando.set(false);
      this.appRef.tick();
    }, 800);
  }

  /** Cierra el modal con la tecla Escape cuando está abierto. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.abierto() && !this.enviando()) {
      this.cerrar();
    }
  }
}
