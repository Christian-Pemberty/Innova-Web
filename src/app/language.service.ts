import { Injectable, computed, signal } from '@angular/core';

/** Idiomas soportados por el portal. */
export type Idioma = 'es' | 'en';

/**
 * Claves de las cadenas traducibles. Agrupamos por dominio (navbar, hero,
 * filtros, botones, footer) usando prefijos para mantener un único espacio plano
 * y fácil de consumir con `t(clave)`.
 */
export type ClaveTraduccion =
  | 'nav.inicio'
  | 'nav.noticias'
  | 'nav.favoritos'
  | 'nav.crearNoticia'
  | 'nav.contacto'
  | 'nav.cerrarSesion'
  | 'nav.iniciarSesion'
  | 'nav.registrarse'
  | 'nav.idioma'
  | 'hero.label'
  | 'hero.titulo'
  | 'hero.tituloResaltado'
  | 'hero.tituloCierre'
  | 'hero.descripcion'
  | 'hero.explorar'
  | 'hero.contactar'
  | 'hero.badgeNumero'
  | 'hero.badgeTexto'
  | 'filtro.todas'
  | 'filtro.educativas'
  | 'filtro.tecnologicas'
  | 'filtro.turisticas'
  | 'filtro.comerciales'
  | 'home.noticiasDestacadas'
  | 'home.subtitulo'
  | 'home.verTodo'
  | 'home.cargando'
  | 'home.nadaEncontrado'
  | 'home.verTodas'
  | 'home.ctaTitulo'
  | 'home.ctaDescripcion'
  | 'home.redactor'
  | 'home.phTitulo'
  | 'home.phDescripcion'
  | 'home.crearBorrador'
  | 'home.categorias'
  | 'home.borradorCreado'
  | 'home.confirmarEliminar'
  | 'footer.marcaDesc'
  | 'footer.explorar'
  | 'footer.contactoOficial'
  | 'footer.copyright'
  | 'footer.equipo'
  | 'footer.privacidad'
  | 'footer.terminos'
  | 'auth.inicioSesionExito'
  | 'auth.correoRequerido'
  | 'auth.correoInvalido'
  | 'auth.campoRequerido'
  | 'auth.contrasenaDebil'
  | 'auth.nombreMinimo'
  | 'auth.caracteresMinimos'
  | 'auth.enlaceRecuperado'
  | 'contacto.gracias'
  | 'crear.borradorDefault'
  | 'crear.label'
  | 'crear.title'
  | 'crear.subtitulo'
  | 'crear.titulo'
  | 'crear.categoria'
  | 'crear.categoriaPlaceholder'
  | 'crear.descripcion'
  | 'crear.descripcionPlaceholder'
  | 'crear.imagen'
  | 'crear.imagenPlaceholder'
  | 'crear.ayuda'
  | 'crear.volver'
  | 'crear.publicar'
  | 'crear.feedback'
  | 'contacto.label'
  | 'contacto.title'
  | 'contacto.subtitulo'
  | 'contacto.volver'
  | 'contacto.redaccion'
  | 'contacto.correo'
  | 'contacto.telefono'
  | 'contacto.ubicacion'
  | 'contacto.nombre'
  | 'contacto.email'
  | 'contacto.asunto'
  | 'contacto.mensaje'
  | 'contacto.enviar'
  | 'card.verMas'
  | 'card.eliminar'
  | 'card.favAgregar'
  | 'card.favQuitar'

export type Diccionario = Record<ClaveTraduccion, string>;

/**
 * Diccionario básico de traducciones para los textos principales del portal
 * (Navbar, Hero, Filtros, Botones y Footer).
 */
const TRADUCCIONES: Record<Idioma, Diccionario> = {
  es: {
    'nav.inicio': 'Inicio',
    'nav.noticias': 'Noticias',
    'nav.favoritos': 'Favoritos',
    'nav.crearNoticia': 'Crear Noticia',
    'nav.contacto': 'Contacto',
    'nav.cerrarSesion': 'Cerrar sesión',
    'nav.iniciarSesion': 'Iniciar sesión',
    'nav.registrarse': 'Regístrate',
    'nav.idioma': 'Idioma',
    'hero.label': 'PORTAL DE INNOVACIÓN Y FUTURO',
    'hero.titulo': 'Explora nuevas experiencias',
    'hero.tituloResaltado': 'educativas, tecnológicas, turísticas',
    'hero.tituloCierre': 'y comerciales.',
    'hero.descripcion':
      'Conectamos ideas disruptivas, análisis profundos de la industria y las últimas tendencias globales bajo una mirada analítica, limpia y objetiva. El futuro, redactado hoy.',
    'hero.explorar': 'Explorar Noticias',
    'hero.contactar': 'Contactar',
    'hero.badgeNumero': '+15k Lectores',
    'hero.badgeTexto': 'Suscritos esta semana',
    'filtro.todas': 'Todas',
    'filtro.educativas': 'Educativas',
    'filtro.tecnologicas': 'Tecnológicas',
    'filtro.turisticas': 'Turísticas',
    'filtro.comerciales': 'Comerciales',
    'home.noticiasDestacadas': 'Noticias Destacadas',
    'home.subtitulo': 'Selección diaria de la redacción de Innova.',
    'home.verTodo': 'Ver todo el archivo',
    'home.cargando': 'Cargando la portada…',
    'home.nadaEncontrado': 'No se encontraron noticias en esta categoría.',
    'home.verTodas': 'Ver todas las noticias',
    'home.ctaTitulo': 'Sé parte de la conversación. Publica tus propias noticias.',
    'home.ctaDescripcion':
      'En Innova creemos en el periodismo abierto y distribuido. Si lideras un proyecto tecnológico, un emprendimiento comercial, turístico o educativo, nuestra plataforma te ofrece un espacio estructurado para interactuar y dar visibilidad a tu historia.',
    'home.redactor': 'Redactor Rápido',
    'home.phTitulo': 'Título de tu artículo…',
    'home.phDescripcion': 'Descripción breve del artículo (opcional)…',
    'home.crearBorrador': 'Crear Borrador',
    'home.categorias': 'Categorías…',
    'home.borradorCreado': 'Borrador «{titulo}» creado y visible en la portada.',
    'home.confirmarEliminar': '¿Eliminar esta noticia? Esta acción no se puede deshacer.',
    'footer.marcaDesc':
      'La plataforma definitiva de noticias e inteligencia de mercado sobre la convergencia de la tecnología, los negocios y la educación del mañana.',
    'footer.explorar': 'Explorar',
    'footer.contactoOficial': 'Contacto Oficial',
    'footer.copyright': '© {anio} Innova S.A. Todos los derechos reservados.',
    'footer.equipo': 'Creado por el Equipo de FRONT END del gran Colombiano Equipo 20',
    'footer.privacidad': 'Política de Privacidad',
    'footer.terminos': 'Términos de Uso',
    'auth.inicioSesionExito': '¡Inicio de sesión exitoso!',
    'auth.correoRequerido': 'Este campo es obligatorio.',
    'auth.correoInvalido': 'Ingresa un correo válido.',
    'auth.campoRequerido': 'Este campo es obligatorio.',
    'auth.contrasenaDebil': 'Usá al menos una letra y un número.',
    'auth.nombreMinimo': 'El nombre debe tener al menos 2 caracteres.',
    'auth.caracteresMinimos': 'Debe tener al menos {longitud} caracteres.',
    'auth.enlaceRecuperado': 'Se ha enviado un enlace de recuperación a {correo}',
    'contacto.gracias': 'Gracias, {nombre}. Tu mensaje fue enviado correctamente.',
    'crear.borradorDefault': 'Borrador publicado desde el editor de Innova.',
    'crear.label': 'REDACCIÓN ABIERTA',
    'crear.title': 'Crea una noticia',
    'crear.subtitulo': 'Escribe el título, elige la categoría y comparte tu historia con la comunidad de Innova.',
    'crear.titulo': 'Título *',
    'crear.categoria': 'Categoría *',
    'crear.categoriaPlaceholder': 'Categorías…',
    'crear.descripcion': 'Descripción',
    'crear.descripcionPlaceholder': 'Resume tu artículo en pocas líneas (opcional)…',
    'crear.imagen': 'Imagen (URL)',
    'crear.imagenPlaceholder': 'https://ejemplo.com/portada.jpg (opcional)',
    'crear.ayuda': 'Si la dejas vacía, se asignará una imagen de ejemplo.',
    'crear.volver': 'Volver al inicio',
    'crear.publicar': 'Publicar noticia',
    'crear.feedback': 'Noticia «{titulo}» publicada y visible en la portada.',
    'contacto.label': 'HABLEMOS',
    'contacto.title': 'Contacto',
    'contacto.subtitulo': '¿Tienes una historia, un proyecto o una inquietud? Estamos para escucharte.',
    'contacto.volver': 'Volver al inicio',
    'contacto.redaccion': 'Redacción de Innova',
    'contacto.correo': 'Correo electrónico',
    'contacto.telefono': 'Teléfono (Lun–Vie, 9:00 a 18:00)',
    'contacto.ubicacion': 'Ubicación',
    'contacto.nombre': 'Nombre completo',
    'contacto.email': 'Correo electrónico',
    'contacto.asunto': 'Asunto',
    'contacto.mensaje': 'Mensaje',
    'contacto.enviar': 'Enviar mensaje',
    'card.verMas': 'Ver más',
    'card.eliminar': 'Eliminar noticia',
    'card.favAgregar': 'Añadir a favoritos',
    'card.favQuitar': 'Quitar de favoritos'
  },
  en: {
    'nav.inicio': 'Home',
    'nav.noticias': 'News',
    'nav.favoritos': 'Favorites',
    'nav.crearNoticia': 'Create Article',
    'nav.contacto': 'Contact',
    'nav.cerrarSesion': 'Sign out',
    'nav.iniciarSesion': 'Log in',
    'nav.registrarse': 'Sign up',
    'nav.idioma': 'Language',
    'hero.label': 'INNOVATION & FUTURE PORTAL',
    'hero.titulo': 'Explore new',
    'hero.tituloResaltado': 'educational, technological, tourism',
    'hero.tituloCierre': 'and commercial experiences.',
    'hero.descripcion':
      'We connect disruptive ideas, deep industry analysis and the latest global trends under a clean, analytical and objective lens. The future, written today.',
    'hero.explorar': 'Explore News',
    'hero.contactar': 'Contact Us',
    'hero.badgeNumero': '+15k Readers',
    'hero.badgeTexto': 'Subscribed this week',
    'filtro.todas': 'All',
    'filtro.educativas': 'Educational',
    'filtro.tecnologicas': 'Technological',
    'filtro.turisticas': 'Tourism',
    'filtro.comerciales': 'Commercial',
    'home.noticiasDestacadas': 'Featured News',
    'home.subtitulo': 'A daily pick from the Innova newsroom.',
    'home.verTodo': 'View all archive',
    'home.cargando': 'Loading the front page…',
    'home.nadaEncontrado': 'No news found in this category.',
    'home.verTodas': 'View all news',
    'home.ctaTitulo': 'Be part of the conversation. Publish your own news.',
    'home.ctaDescripcion':
      'At Innova we believe in open and distributed journalism. If you lead a tech project, a business, a tourism or an education venture, our platform offers you a structured space to interact and give visibility to your story.',
    'home.redactor': 'Quick Editor',
    'home.phTitulo': 'Your article title…',
    'home.phDescripcion': 'A short article description (optional)…',
    'home.crearBorrador': 'Create Draft',
    'home.categorias': 'Categories…',
    'home.borradorCreado': 'Draft “{titulo}” created and visible on the front page.',
    'home.confirmarEliminar': 'Delete this article? This action cannot be undone.',
    'footer.marcaDesc':
      'The definitive platform for news and market intelligence at the intersection of technology, business and tomorrow’s education.',
    'footer.explorar': 'Explore',
    'footer.contactoOficial': 'Official Contact',
    'footer.copyright': '© {anio} Innova S.A. All rights reserved.',
    'footer.equipo': 'Built by the FRONT END team of the great Colombian Team 20',
    'footer.privacidad': 'Privacy Policy',
    'footer.terminos': 'Terms of Use',
    'auth.inicioSesionExito': 'Login successful!',
    'auth.correoRequerido': 'This field is required.',
    'auth.correoInvalido': 'Enter a valid email.',
    'auth.campoRequerido': 'This field is required.',
    'auth.contrasenaDebil': 'Use at least one letter and one number.',
    'auth.nombreMinimo': 'The name must have at least 2 characters.',
    'auth.caracteresMinimos': 'Must have at least {longitud} characters.',
    'auth.enlaceRecuperado': 'A recovery link has been sent to {correo}',
    'contacto.gracias': 'Thanks, {nombre}. Your message was sent successfully.',
    'crear.borradorDefault': 'Draft published from the Innova editor.',
    'crear.label': 'OPEN WRITING',
    'crear.title': 'Create a news',
    'crear.subtitulo': 'Write the title, choose the category and share your story with the Innova community.',
    'crear.titulo': 'Title *',
    'crear.categoria': 'Category *',
    'crear.categoriaPlaceholder': 'Categories…',
    'crear.descripcion': 'Description',
    'crear.descripcionPlaceholder': 'Summarize your article in a few lines (optional)…',
    'crear.imagen': 'Image (URL)',
    'crear.imagenPlaceholder': 'https://example.com/cover.jpg (optional)',
    'crear.ayuda': 'If you leave it empty, a sample image will be assigned.',
    'crear.volver': 'Back to home',
    'crear.publicar': 'Publish news',
    'crear.feedback': 'News «{titulo}» published and visible on the front page.',
    'contacto.label': 'LET\'S TALK',
    'contacto.title': 'Contact',
    'contacto.subtitulo': 'Do you have a story, a project, or a question? We\'re here to listen.',
    'contacto.volver': 'Back to home',
    'contacto.redaccion': 'Innova Newsroom',
    'contacto.correo': 'Email',
    'contacto.telefono': 'Phone (Mon–Fri, 9:00 to 18:00)',
    'contacto.ubicacion': 'Location',
    'contacto.nombre': 'Full name',
    'contacto.email': 'Email address',
    'contacto.asunto': 'Subject',
    'contacto.mensaje': 'Message',
    'contacto.enviar': 'Send message',
    'card.verMas': 'Read more',
    'card.eliminar': 'Delete article',
    'card.favAgregar': 'Add to favorites',
    'card.favQuitar': 'Remove from favorites'
  }
};

@Injectable({ providedIn: 'root' })
export class IdiomaService {
  /** Clave fija bajo la que el servicio persiste la preferencia en localStorage. */
  private static readonly STORAGE_KEY = 'innova:idioma';

  /** Idioma activo; los componentes pueden leer `idioma` como señal reactiva. */
  private readonly _idioma = signal<Idioma>(this.leeAlmacenamiento());
  /** Señal de solo-lectura del idioma activo. */
  readonly idioma = this._idioma.asReadonly();

  /** `true` cuando el idioma activo es inglés. */
  readonly esInglés = computed(() => this._idioma() === 'en');

  /** Traduce `clave` al idioma actualmente activo. */
  t(clave: ClaveTraduccion): string {
    return TRADUCCIONES[this._idioma()][clave];
  }

  /** Traduce `clave` y sustituye un mapa de variables (`{token}` → valor). */
  tConParametros(clave: ClaveTraduccion, parametros?: Record<string, string>): string {
    let texto = this.t(clave);
    if (parametros) {
      for (const [token, valor] of Object.entries(parametros)) {
        texto = texto.replaceAll(`{${token}}`, valor);
      }
    }
    return texto;
  }

  /** Establece el idioma activo y persiste la preferencia en localStorage. */
  setLanguage(idioma: Idioma): void {
    if (this._idioma() === idioma) {
      return;
    }
    this._idioma.set(idioma);
    this.guardaAlmacenamiento(idioma);
  }

  /** Alterna entre Español e Inglés y persiste la preferencia. */
  toggleLanguage(): void {
    this.setLanguage(this._idioma() === 'es' ? 'en' : 'es');
  }

  /** Recupera el idioma guardado en localStorage, o `'es'` como valor por defecto. */
  private leeAlmacenamiento(): Idioma {
    try {
      const crudo = localStorage.getItem(IdiomaService.STORAGE_KEY);
      if (crudo === 'es' || crudo === 'en') {
        return crudo;
      }
    } catch (error) {
      console.warn('[Innova] No se pudo leer la preferencia de idioma.', error);
    }
    return 'es';
  }

  /** Persiste el idioma en localStorage. */
  private guardaAlmacenamiento(idioma: Idioma): void {
    try {
      localStorage.setItem(IdiomaService.STORAGE_KEY, idioma);
    } catch (error) {
      console.warn('[Innova] No se pudo guardar la preferencia de idioma.', error);
    }
  }
}
