## Why

`davidmariolc.dev` es hoy el template de shadcn: `app/page.tsx` sigue mostrando "Project ready!" y las dependencias clave del proyecto (`velite`, `next-intl`, `next-themes`, `next-cloudinary`, `motion`) están instaladas pero sin configurar. No existe ni portafolio ni blog, así que no hay dónde publicar trabajo ni escritura técnica.

Existe ya un diseño acordado del home (mockup EN) que fija la estructura, las secciones y la estética, por lo que el trabajo pasa de "diseñar un sitio" a "implementar una estructura conocida". Esta propuesta cubre el sitio completo, dividido en fases implementables en varias sesiones.

## What Changes

- **Pipeline de contenido con Velite**: se configura `velite.config.ts` con una colección por tipo de contenido (`posts`, `projects`, `achievements`, `community`, `books`, `setup`) y un `siteProfile` singleton para la intro del home. Todo el contenido vive en MDX/YAML con frontmatter tipado y campo `locale`.
- **i18n con next-intl**: dos idiomas (`en`, `es`) con prefijo de ruta **siempre presente** (`/en/...`, `/es/...`). `/` redirige al idioma detectado. Cada pieza de contenido existe por idioma y el switcher preserva la ruta actual.
- **Shell del sitio**: layout raíz por locale, nav superior (Home · Projects · Books · Setup · Posts + switcher EN|ES), footer de dos columnas (Social / Community), tema oscuro por defecto vía `next-themes`, y el sistema tipográfico del mockup (mono para nav y títulos de sección, sans para prosa, acento amarillo).
- **Home**: composición de las siete secciones del mockup — cabecera con avatar, intro de tres párrafos con logos de marca inline, Projects (3 destacados + "View all"), Posts (con estado vacío "Coming soon…"), Achievements, Community y footer.
- **Proyectos**: índice `/[locale]/projects` y detalle `/[locale]/projects/[slug]` renderizando el cuerpo MDX del proyecto.
- **Blog**: índice `/[locale]/posts` y detalle `/[locale]/posts/[slug]`, con render de MDX (encabezados con ancla, bloques de código resaltados, componentes React embebidos para futuras animaciones de concepto), tags y tiempo de lectura.
- **Secciones restantes**: `/[locale]/books` y `/[locale]/setup` como páginas de listado; Community y Achievements se muestran en el home con su índice propio.
- **Imágenes vía Cloudinary**: previews de proyectos, fotos de comunidad y avatar se sirven con `next-cloudinary` a partir de un `publicId` guardado en el frontmatter.
- **Logos de marca vía svgl**: los logos inline de la intro y las cards se instalan con el CLI de shadcn desde el registro `@svgl` ya declarado en `components.json`; los iconos de interfaz siguen siendo `lucide-react`.
- **SEO y sindicación**: metadata por página, `hreflang` entre locales, `sitemap.xml`, `robots.txt`, imágenes OG generadas y feed RSS del blog por idioma.
- Se elimina el contenido de template (`app/page.tsx`, README del template).

No incluye (fuera de alcance): formulario de contacto o backend, comentarios en posts, analítica, búsqueda, modo claro pulido más allá del soporte de tokens, y CMS externo.

## Capabilities

### New Capabilities
- `content-pipeline`: colecciones de Velite, esquema de frontmatter por tipo de contenido, resolución por idioma y contrato de datos que consumen las páginas.
- `i18n-routing`: estrategia de rutas con prefijo de locale, negociación de idioma, catálogos de mensajes de UI y switcher que preserva la ruta.
- `site-shell`: layout por locale, navegación, footer, tema y sistema de diseño (tipografía, color, espaciado, bordes).
- `home-page`: composición y comportamiento de las siete secciones del home, incluidos los estados vacíos.
- `projects`: índice y detalle de proyectos.
- `blog`: índice y detalle de posts, render de MDX, tags y tiempo de lectura.
- `content-sections`: páginas e índices de Books, Setup, Community y Achievements.
- `site-metadata`: metadata, `hreflang`, sitemap, robots, imágenes OG y RSS.

### Modified Capabilities
<!-- Ninguna: `openspec/specs/` está vacío; todas las capacidades son nuevas. -->

## Impact

- **Rutas**: se introduce el segmento `[locale]`; toda URL pública queda bajo `/en` o `/es`. `app/page.tsx` pasa a ser una redirección.
- **Código afectado**: `app/` (reestructurado), `components/` (shell, secciones, MDX), `lib/` (acceso a contenido, i18n), `next.config.ts` (plugin de next-intl, dominios de imagen, integración del build de Velite), `middleware.ts` (nuevo), `messages/` (nuevo), `content/` (nuevo).
- **Dependencias**: se configuran las ya instaladas (`velite`, `next-intl`, `next-themes`, `next-cloudinary`, `motion`). Se añadirán las de MDX que Velite requiera para resaltado de código y encabezados con ancla (p. ej. `shiki`/`rehype-pretty-code`, `rehype-slug`).
- **Entorno**: nuevas variables para Cloudinary (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`) y la URL canónica del sitio.
- **Build**: Velite se ejecuta como paso previo/integrado al build; `.velite/` se ignora en git y su salida se consume vía alias de TypeScript.
- **Contenido**: publicar requiere escribir cada pieza en los dos idiomas, o aceptar el fallback definido en `content-pipeline`.
