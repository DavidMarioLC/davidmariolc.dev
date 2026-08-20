## 1. Fase 1 — Base: contenido, i18n y shell

- [x] 1.1 Añadir `concurrently` como devDependency y ajustar scripts: `build` = `velite && next build`, `dev` = `velite --watch` en paralelo a `next dev`; ignorar `.velite/` en `.gitignore`
- [x] 1.2 Crear `velite.config.ts` con el esquema de las colecciones `posts`, `projects`, `books`, `setup`, `achievements`, `community` y `profile`, derivando el idioma de la ruta del archivo y el slug del nombre
- [x] 1.3 Añadir el alias `#site/content` a `tsconfig.json` apuntando a `.velite` y verificar que los tipos se infieren sin `any`
- [x] 1.4 Crear `lib/content.ts` con los accesos por tipo e idioma (listar, buscar por slug, comprobar existencia de traducción), incluyendo el filtro de borradores en producción
- [x] 1.5 Sembrar contenido mínimo real en ambos idiomas: perfil, un proyecto, un logro, un ítem de comunidad — suficiente para ver el home
- [x] 1.6 Verificar que un frontmatter inválido y un slug duplicado hacen fallar el build con un error que nombra el archivo
- [x] 1.7 Crear `i18n/routing.ts` (`locales: ['en','es']`, `defaultLocale: 'en'`, `localePrefix: 'always'`) y los helpers de navegación tipados
- [x] 1.8 Crear `i18n/request.ts` y conectar el plugin de next-intl en `next.config.ts`
- [x] 1.9 Leer `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` y crear `proxy.ts` con `createMiddleware`, con un `matcher` que excluya `_next`, `api`, estáticos y archivos de metadata
- [x] 1.10 Crear `messages/en.json` y `messages/es.json` con las claves de nav, títulos de sección, estados vacíos y textos de accesibilidad
- [x] 1.11 Añadir una comprobación que falle si los dos catálogos de mensajes no tienen el mismo conjunto de claves, y engancharla al script `check`
- [x] 1.12 Reestructurar `app/`: eliminar `app/page.tsx` del template, crear `app/[locale]/layout.tsx` con `generateStaticParams`, `lang` correcto y el proveedor de mensajes; recordar que `params` es una promesa
- [x] 1.13 Definir los tokens del sistema visual en `app/globals.css` con `@theme` (color, acento, bordes, radios) y las dos familias tipográficas ya cargadas
- [x] 1.14 Configurar `next-themes` con tema oscuro por defecto y comprobar que no hay destello de tema en la carga inicial
- [x] 1.15 Construir el componente de navegación superior: enlaces a Home, Projects, Books, Setup, Posts, sección activa señalada visualmente y para lectores de pantalla, foco visible y sin desbordamiento en móvil
- [x] 1.16 Construir el switcher EN|ES: preserva la ruta actual, marca el idioma activo, recuerda la elección y cae al índice de la sección cuando no hay traducción
- [x] 1.17 Construir el pie con los grupos Social y Community, enlaces externos seguros y con nombre accesible
- [x] 1.18 Crear `not-found.tsx` y `error.tsx` por locale, dentro del marco del sitio y traducidos
- [x] 1.19 Verificar manualmente: `/` redirige al idioma negociado, `/es/...` responde 200, un prefijo desconocido da 404, y la preferencia guardada gana sobre el navegador

## 2. Fase 2 — Home

- [x] 2.1 Crear `app/[locale]/page.tsx` con la columna central acotada y el orden de secciones del mockup
- [x] 2.2 Construir la cabecera de identidad: avatar, nombre y país desde el perfil, con alternativa textual correcta
- [x] 2.3 Instalar con el CLI de shadcn los logos de svgl necesarios para la intro (Forma o su sustituto, GDG, Next.js, TypeScript, Supabase, PostgreSQL)
- [x] 2.4 Crear `lib/logo-registry.ts` que traduce el identificador del frontmatter al componente y a su variante clara/oscura, fallando en build ante un identificador desconocido
- [x] 2.5 Construir el componente de introducción: párrafos con referencias inline (logo + nombre, con o sin enlace) alineadas a la línea base y remate con el color de acento
- [x] 2.6 Crear `<CloudImage>` sobre `CldImage` con `alt` obligatorio, dimensiones y `sizes` por defecto; declarar `images.remotePatterns` y las variables de entorno en `next.config.ts`
- [x] 2.7 Construir la sección Projects del home: hasta tres destacados por marca explícita, con fallback a los tres más recientes, cada card con preview, título, descripción y acceso al detalle
- [x] 2.8 Construir la sección Posts con su estado vacío traducido y el paso automático a listado cuando exista el primer post
- [x] 2.9 Construir la sección Achievements: logo, nombre, tipo en mayúsculas, año, orden cronológico inverso y enlace externo solo cuando exista
- [x] 2.10 Construir la sección Community: texto descriptivo y galería numerada con título y fecha formateados según el idioma
- [x] 2.11 Añadir los enlaces "View all" de Projects, Posts y Community
- [x] 2.12 Revisar el home contra el mockup y verificar contraste AA, jerarquía de encabezados y ausencia de desbordamiento horizontal en móvil

## 3. Fase 3 — Proyectos

- [x] 3.1 Crear `app/[locale]/projects/page.tsx` con todos los proyectos publicados en orden declarado estable
- [x] 3.2 Crear `app/[locale]/projects/[slug]/page.tsx` con `generateStaticParams` y `dynamicParams = false`
- [x] 3.3 Crear el componente `<Mdx>` con el mapa explícito de componentes permitidos y la cadena `rehype-slug` + `rehype-autolink-headings` + `rehype-pretty-code`, y añadir las dependencias correspondientes
- [x] 3.4 Aplicar los estilos de prosa del sistema visual al cuerpo renderizado (encabezados, listas, citas, tablas, código, imágenes)
- [x] 3.5 Mostrar el stack del proyecto con logotipos vía el registro de logos
- [x] 3.6 Mostrar los enlaces externos declarados (producción, repositorio) omitiendo los ausentes
- [x] 3.7 Migrar los proyectos del mockup (SQM Nutrition, Matra CAT, AI Agents Platform) a contenido real en ambos idiomas
- [x] 3.8 Verificar que un slug inexistente responde 404 y que todas las rutas de proyecto se generan en el build

## 4. Fase 4 — Blog

- [x] 4.1 Crear `app/[locale]/posts/page.tsx` con orden cronológico inverso, resumen, fecha y tiempo de lectura, y su estado vacío
- [x] 4.2 Derivar el tiempo de lectura en el pipeline de contenido, sin campo manual
- [x] 4.3 Crear `app/[locale]/posts/[slug]/page.tsx` con `generateStaticParams` y `dynamicParams = false`
- [x] 4.4 Verificar el render del cuerpo: anclas de encabezado compartibles, bloques de código resaltados sin desbordamiento y con texto seleccionable, imágenes con dimensiones reservadas
- [x] 4.5 Habilitar componentes interactivos embebidos en posts y hacer que un componente no registrado falle el build nombrando post y componente
- [x] 4.6 Añadir etiquetas: mostradas en índice y detalle, con página de posts por etiqueta
- [x] 4.7 Escribir un primer post real en ambos idiomas que ejercite código, imágenes, encabezados y un componente embebido

## 5. Fase 5 — Books y Setup

- [x] 5.1 Crear `app/[locale]/books/page.tsx`: cabecera con título, subtítulo e intro; los tres grupos de estado de lectura en orden fijo; rejilla de portadas en cards con la alternativa textual construida desde título y autor; grupos vacíos omitidos
- [x] 5.2 Crear `app/[locale]/setup/page.tsx`: cabecera con título y subtítulo, bloque de hardware como rejilla de cards etiqueta/valor, y los bloques de stack, editor y apps como filas categoría → entradas con logotipo opcional y sin enlaces
- [x] 5.3 Enlazar la sección de comunidad del home al sitio de la comunidad, con la URL declarada en el contenido y tratamiento de enlace externo
- [x] 5.4 Confirmar que los logros se listan completos en el home, sin página de índice aparte
- [x] 5.5 Poblar el contenido real de Books en ambos idiomas (Setup poblado en 5.2)
- [x] 5.6 Verificar que cada sección sin contenido en un idioma muestra su estado vacío traducido y no un 404

## 6. Fase 6 — SEO, sindicación y cierre

- [x] 6.1 Fijar `NEXT_PUBLIC_SITE_URL` y documentar las variables de entorno requeridas
- [x] 6.2 Añadir `generateMetadata` por ruta con título, descripción y canónica absoluta derivados del contenido
- [x] 6.3 Construir `alternates.languages` a partir de la existencia real de la traducción, sin declarar URLs inexistentes
- [x] 6.4 Crear las imágenes OG con `opengraph-image.tsx` e `ImageResponse`, con plantilla común y fallback del sitio
- [x] 6.5 Crear `app/sitemap.ts` con todas las páginas públicas de ambos idiomas y su fecha de modificación, excluyendo borradores
- [x] 6.6 Crear `app/robots.ts` permitiendo indexación y apuntando al sitemap
- [x] 6.7 Crear el feed por idioma como Route Handler y anunciarlo con `<link rel="alternate">` en las páginas del blog
- [x] 6.8 Añadir datos estructurados: perfil del autor en el home y artículo en cada detalle de post
- [x] 6.9 Sustituir el README del template por el del proyecto (arranque, escritura de contenido, variables de entorno)
- [x] 6.10 Pasar `pnpm dlx ultracite fix`, `pnpm check`, `pnpm typecheck` y `pnpm build` en limpio
- [x] 6.11 Revisión final de accesibilidad: navegación por teclado, contraste, jerarquía de encabezados y respeto a la preferencia de movimiento reducido
