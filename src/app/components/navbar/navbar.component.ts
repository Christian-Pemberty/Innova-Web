import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RegistroService } from '../../registro.service';
import { AuthService } from '../../auth.service';
import { IdiomaService } from '../../language.service';

interface EnlaceNav {
  etiqueta: string;
  ruta: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly navElement = inject(ElementRef<HTMLElement>);

  /** Enlaces de navegación principales del portal (etiquetas reactivas al idioma). */
  readonly enlaces = computed<EnlaceNav[]>(() => [
    { etiqueta: this.idiomaService.t('nav.inicio'), ruta: '/' },
    { etiqueta: this.idiomaService.t('nav.noticias'), ruta: '/noticias' },
    { etiqueta: this.idiomaService.t('nav.favoritos'), ruta: '/favoritos' },
    { etiqueta: this.idiomaService.t('nav.crearNoticia'), ruta: '/crear-noticia' },
    { etiqueta: this.idiomaService.t('nav.contacto'), ruta: '/contacto' }
  ]);

  /** Servicio global de idiomas; alimenta las etiquetas del navbar en vivo. */
  readonly idiomaService = inject(IdiomaService);

  /** Servicio global que orquesta el modal de registro y la sesión. */
  private readonly registroService = inject(RegistroService);

  /** Servicio global que orquesta el modal de inicio de sesión. */
  private readonly authService = inject(AuthService);

  /** Sesión activa (señal reactiva del servicio). */
  protected readonly sesion = this.registroService.sesion;

  /** Primer nombre del usuario logueado (pseudónimo visible), o `null` si no hay sesión. */
  protected primerNombre(): string | null {
    const s = this.registroService.sesion();
    return s ? s.nombre.split(' ')[0] : null;
  }

  /** Cierra la sesión simulada (logout). */
  onLogout(): void {
    this.registroService.cerrarSesion();
  }

  /** Abre el modal de registro a través del servicio global. */
  abrirRegistro(): void {
    this.registroService.abrir();
  }

  /** Abre el modal de inicio de sesión. */
  abrirLogin(): void {
    this.authService.abrir();
  }

  /** Alterna el idioma visible (ES ⇄ EN) y persiste la preferencia. */
  cambiarIdioma(): void {
    this.idiomaService.toggleLanguage();
  }

  /** Código corto del idioma activo para mostrar en el selector (ES / EN). */
  codigoIdioma(): string {
    return this.idiomaService.esInglés() ? 'EN' : 'ES';
  }

  /** Estado del menú móvil (hamburguesa). */
  readonly menuAbierto = signal(false);

  constructor() {
    // Cierra el menú móvil al completar una navegación.
    this.router.events
      .pipe(
        filter((evento) => evento instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.menuAbierto.set(false));
  }

  toggleMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  /** Cierra el menú si el clic ocurre fuera de la barra y de los elementos interactivos móviles. */
  @HostListener('document:click', ['$event'])
  onClickFuera(evento: Event): void {
    const target = evento.target as Node | null;
    if (!target) return;

    const elMeniuMovil = document.getElementById('menu-movil');
    // Si se clickeó dentro del menú móvil, no cerrar (botones, selector de idioma, etc).
    if (elMeniuMovil && elMeniuMovil.contains(target)) return;

    const nav = this.navElement.nativeElement;
    // Si se clickeó en un botón interactivo del navbar (hamburguesa, enlaces), no cerrar.
    if ((target as HTMLElement).closest('.nav-toggle, .lang-link, .btn-innova, .btn-innova-secundaria')) return;

    if (!nav.contains(target)) {
      this.cerrarMenu();
    }
  }

  /** Cierra el menú con la tecla Escape. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrarMenu();
  }
}
