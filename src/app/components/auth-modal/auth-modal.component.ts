import { Component, HostListener, inject, signal, effect, ApplicationRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { IdiomaService } from '../../language.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly appRef = inject(ApplicationRef);
  private readonly idiomas = inject(IdiomaService);

  /** Estado reactivo del modal. */
  protected readonly abierto = this.auth.abierto;
  
  /** Mensaje de estado (éxito/error). */
  protected readonly mensaje = this.auth.estado;

  /** Tab activa: 'login' | 'recuperar' */
  protected tabActiva = signal<'login' | 'recuperar'>('login');

  mostrarClave = signal(false);
  enviando = signal(false);

  protected readonly formLogin = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]],
  });

  private tick(): void {
    this.appRef.tick();
  }

  constructor() {
    effect(() => {
      document.body.classList.toggle('modal-open', this.auth.abierto());
    });
  }

  cambiarTab(tab: 'login' | 'recuperar'): void {
    this.tabActiva.set(tab);
    (this.formLogin as any)._errors = null;
    this.tick();
  }

  cerrar(): void {
    this.formLogin.reset();
    this.mostrarClave.set(false);
    this.enviando.set(false);
    this.tabActiva.set('login');
    this.tick();
    this.auth.cerrar();
  }

  onOverlayClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.cerrar();
  }

  toggleClave(): void {
    this.mostrarClave.update(v => !v);
  }

  errorDe(nombre: string): boolean {
    const c = this.formLogin.get(nombre);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  mensajeError(nombre: string): string {
    const c = this.formLogin.get(nombre);
    if (!c || !c.invalid) return '';
    const e = c.errors ?? {};
    if (e['required']) return this.idiomas.t('auth.campoRequerido');
    if (e['email'])     return this.idiomas.t('auth.correoInvalido');
    return '';
  }

  onSubmitLogin(): void {
    this.formLogin.markAllAsTouched();
    if (this.formLogin.invalid || this.enviando()) {
      this.tick();
      return;
    }
    
    const v = this.formLogin.getRawValue();
    const correo = (v.correo ?? '').toString().trim();
    const contrasena = (v.contrasena ?? '').toString();

    this.enviando.set(true);
    this.tick();

    // Simular latencia de API
    setTimeout(() => {
      this.auth.iniciarSesion(correo, contrasena);
      this.formLogin.reset();
      this.enviando.set(false);
      this.mostrarClave.set(false);
      this.tick();
    }, 800);
  }

  recuClave(): void {
    const c = this.formLogin.get('correo')?.value;
    if (c) {
      alert(this.idiomas.tConParametros('auth.enlaceRecuperado', { correo: c }));
      this.cambiarTab('login');
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.abierto() && !this.enviando()) this.cerrar();
  }
}
