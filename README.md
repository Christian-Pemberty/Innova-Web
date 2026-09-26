# Portal de noticias e innovación — **Equipo 20 · FRONT END · Politécnico Grancolombiano**

## Descripción

Innova es un portal de noticias digital diseñado y desarrollado por el Equipo 20 de Front End del Politécnico Grancolombiano. La plataforma permite a los usuarios explorar noticias organizadas por categorías, crear sus propias publicaciones, gestionar favoritos y mantenerse conectados con la comunidad a través de un formulario de contacto.

**Características principales:**
- **Noticias en vivo** con categorías: Educativas, Tecnológicas, Turísticas y Comerciales
- **Redactor rápido** para crear y publicar borradores directamente desde la portada
- **Favoritos** para guardar noticias de interés
- **Bilingüe**: Soporte completo en Español e Inglés
- **Registro e inicio de sesión** con sesión persistente
- **Eliminación** de noticias con confirmación
- **Diseño responsivo** con Bootstrap 5

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| **Framework** | [Angular 21](https://angular.dev/) |
| **Lenguaje** | [TypeScript 5.9](https://www.typescriptlang.org/) |
| **CSS** | [Bootstrap 5.3](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/) + [Lucide](https://lucide.dev/) |
| **Reactive State** | [Angular Signals](https://angular.dev/guide/signals) |
| **HTTP Client** | Angular `HttpClient` |
| **Testing** | [Vitest](https://vitest.dev/) |
| **Build Tool** | [Angular CLI](https://github.com/angular/angular-cli) v21.2.24 |
| **Paquetes** | [npm](https://www.npmjs.com/) |

---

## Estructura del proyecto

```
innova/
├── public/
│   └── noticias.json          # Datos iniciales de noticias (JSON estático)
├── src/
│   ├── app/
│   │   ├── app.config.ts      # Configuración global de la aplicación
│   │   ├── app.routes.ts      # Definición de rutas (routing lazy-loaded)
│   │   ├── noticia.service.ts # Servicio principal: CRUD de noticias + localStorage
│   │   ├── registro.service.ts# Servicio de autenticación y registro de usuarios
│   │   ├── language.service.ts# Servicio de internacionalización (es / en)
│   │   ├── app.ts             # Componente raíz
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.spec.ts        # Pruebas del componente raíz
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── news-card/     # Card para mostrar una noticia
│   │   │   └── register-modal/ # Modal de registro de usuario
│   │   └── pages/             # Páginas de la aplicación
│   │       ├── home/          # Página principal (portada con filtros y redactor)
│   │       ├── noticias/      # Listado completo de noticias
│   │       ├── noticia-detalle/ # Vista detallada de una noticia individual
│   │       ├── favoritos/     # Noticias guardadas como favoritas
│   │       ├── crear-noticia/ # Editor para crear una nueva noticia
│   │       ├── registro/      # Formulario de registro de usuario
│   │       ├── iniciar-sesion/ # Formulario de inicio de sesión
│   │       └── contacto/      # Página de contacto
│   ├── styles.css             # Estilos globales
│   ├── index.html             # Punto de entrada HTML
│   └── main.ts                # Punto de entrada de la aplicación
├── angular.json               # Configuración de Angular CLI
├── package.json               # Dependencias y scripts
├── tsconfig.json              # Configuración de TypeScript
└── README.md                  # Este archivo
```

---

## Rutas de navegación

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio (portada con noticias destacadas, filtros y redactor) |
| `/noticias` | Listado completo de todas las noticias |
| `/noticias/:id` | Vista detallada de una noticia específica |
| `/favoritos` | Noticias guardadas como favoritas por el usuario |
| `/crear-noticia` | Editor para publicar una nueva noticia |
| `/registro` | Formulario de registro de nuevo usuario |
| `/iniciar-sesion` | Inicio de sesión |
| `/contacto` | Formulario de contacto con la redacción |
| `*` | Redirección a la página de inicio |

---

## Servicios principales

### `NoticiaService`
Gestiona el ciclo de vida completo de las noticias. Utiliza **Angular Signals** para estado reactivo y **localStorage** para persistencia.

- `noticias` — Señal reactiva con la lista de noticias
- `estaCargando` — Indica si la carga inicial está en proceso
- `agregarNoticia()` — Crea una nueva noticia (asigna ID correlativo automáticamente)
- `toggleFavorito(id)` — Alterna el estado de favorito de una noticia
- `eliminarNoticia(id)` — Elimina una noticia
- Carga inicial desde `public/noticias.json` en la primera visita

### `RegistroService`
Gestiona el registro de usuarios y sesiones activas.

- `abierto` — Señal que controla la visibilidad del modal de registro
- `sesion` — Señal reactiva con la sesión activa del usuario
- `registrar(datos)` — Registra un usuario y persiste la sesión en `localStorage`
- `cerrarSesion()` — Cierra la sesión y limpia `localStorage`

### `IdiomaService`
Servicio de internacionalización (i18n) con soporte para **Español** e **Inglés**.

- `idioma` — Señal con el idioma activo (`'es'` o `'en'`)
- `t(clave)` — Traduce una cadena al idioma actual
- `tConParametros(clave, params)` — Traduce con interpolación de variables
- `toggleLanguage()` — Alterna entre idiomas
- Preferencia persistida en `localStorage`
- Más de 80 traducciones organizadas por dominio (nav, hero, filtros, footer, etc.)

---

## Instalación y ejecución

### Requisitos previos
- [Node.js](https://nodejs.org/) (versión recomendada: 18+)
- [npm](https://www.npmjs.com/) (incluido con Node.js)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd Innova

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
ng serve

# 4. Abrir en el navegador
# http://localhost:4200/
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `ng serve` | Inicia el servidor de desarrollo en `localhost:4200` |
| `ng build` | Compila el proyecto para producción |
| `ng test` | Ejecuta las pruebas unitarias con Vitest |
| `ng build --watch --configuration development` | Compila en modo watch para desarrollo |

---

## Testing

Las pruebas unitarias se ejecutan con **[Vitest](https://vitest.dev/)**.

```bash
ng test
```

---

## Notas de diseño y arquitectura

- **State Management**: Se utilizan [Angular Signals](https://angular.dev/guide/signals) como alternativa reactiva a RxJS para el estado de la aplicación. Todos los datos compartidos (noticias, sesión, idioma) expuestos como señales de solo lectura.
- **Persistencia**: El estado de las noticias y la sesión del usuario se persisten en `localStorage` para mantener los datos entre sesiones del navegador.
- **Lazy Loading**: Las páginas se cargan de forma diferida (`loadComponent`) para optimizar el rendimiento inicial.
- **i18n**: El sistema de traducciones usa un diccionario plano con claves tipadas (`ClaveTraduccion`), lo que permite autocompletado y seguridad de tipos en todo el proyecto.
- **Imágenes**: Las imágenes de noticias se obtienen de [Picsum Photos](https://picsum.photos/) con seeds personalizados.

---

## Equipo de desarrollo

> **Proyecto Innova** — Creado por el **Equipo 20 de FRONT END** de la **Universidad Gran Colombia**.

---

## Licencia

Todos los derechos reservados. © 2025 Innova S.A. — [Política de Privacidad](https://innova.com/privacidad) · [Términos de Uso](https://innova.com/terminos)

---

## Recursos adicionales

- [Documentación oficial de Angular](https://angular.dev/docs)
- [Angular CLI — Comandos y referencia](https://angular.dev/tools/cli)
- [Bootstrap 5 — Documentación](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Vitest — Documentación](https://vitest.dev/)
