## Context

Ver `proposal.md` — Why. El punto de partida es el template de shadcn con las dependencias instaladas y sin configurar. Restricciones que condicionan el diseño:

- **Next.js 16 con App Router y Turbopack por defecto.** Dos consecuencias verificadas en `node_modules/next/dist/docs/`: el convenio `middleware.ts` está **deprecado y renombrado a `proxy.ts`** (mismo nivel que `app/`, exporta `proxy` o un default), y no se puede depender de plugins de webpack en el build, porque Turbopack no los ejecuta.
- **Velite 0.4** valida el contenido y emite datos tipados a `.velite/`. No trae integración oficial con Turbopack, así que su ejecución hay que orquestarla desde los scripts de npm.
- **next-intl 4.13** sigue exponiendo `next-intl/middleware`; su `createMiddleware` se monta dentro de `proxy.ts`.
- El sitio es estático: no hay backend, base de datos ni sesiones. Todo lo público debe poder pre-renderizarse.
- El mockup fija la estética y el orden de las secciones del home; el diseño lo asume dado y no lo rediscute.

## Goals / Non-Goals

**Goals:**

- Un único pipeline de contenido: todas las páginas leen datos tipados de una misma capa, nunca del sistema de archivos ni de la red en tiempo de ejecución.
- Que añadir una pieza de contenido (un post, un proyecto, un libro) no requiera tocar código de páginas.
- Que las fases sean desplegables de forma independiente: al terminar cada fase el sitio compila y es navegable.
- Aislar los puntos de acoplamiento a servicios externos (Cloudinary) detrás de un componente propio.

**Non-Goals:**

- Rendimiento en el límite (ISR, streaming granular, edge runtime). El sitio es pequeño y estático; se optimiza cuando haya datos.
- Un design system reutilizable fuera de este sitio. Los tokens y componentes son de este proyecto.
- Paridad de contenido automática entre idiomas. La ausencia de traducción es un estado válido con comportamiento definido, no un error de build.

## Decisions

### 1. Velite se ejecuta desde los scripts, no desde `next.config.ts`

La integración habitual de Velite es un plugin de webpack en `next.config.js`. Con Turbopack por defecto en Next 16 ese plugin no se ejecuta, así que el contenido nunca se generaría.

**Decisión:** `build` ejecuta `velite && next build`; `dev` ejecuta `velite --watch` en paralelo a `next dev` con `concurrently` (nueva devDependency). `.velite/` se ignora en git y se expone con el alias `#site/content` en `tsconfig.json`.

*Alternativas:* forzar webpack en el build (renuncia a Turbopack y a la velocidad de desarrollo); commitear `.velite/` (ruido en cada diff de contenido y conflictos constantes).

*Trade-off:* dos procesos en desarrollo y un fallo de Velite que aparece en una terminal distinta a la de Next. Se acepta a cambio de mantener Turbopack.

### 2. `proxy.ts` con `createMiddleware` de next-intl

El convenio `middleware.ts` está deprecado en Next 16.

**Decisión:** un `proxy.ts` en la raíz que delega en `createMiddleware(routing)` de `next-intl/middleware`, con un `matcher` que excluye `/_next`, `/api`, y los archivos estáticos y de metadata (`sitemap.xml`, `robots.txt`, `feed.xml`, favicon, imágenes). El `routing` se define una sola vez en `i18n/routing.ts` con `localePrefix: 'always'`, `locales: ['en','es']` y `defaultLocale: 'en'`, y es la fuente de la que salen los helpers de navegación (`Link`, `redirect`, `usePathname`) tipados.

*Alternativas:* escribir a mano la negociación de idioma (reimplementar `Accept-Language`, cookies y redirecciones que next-intl ya resuelve).

### 3. Rutas: `app/[locale]/...` con prefijo siempre presente

**Decisión:** todo vive bajo `app/[locale]/`. `app/page.tsx` desaparece; la raíz la resuelve el proxy redirigiendo al idioma negociado. `generateStaticParams` en el segmento de locale y en cada ruta dinámica; `dynamicParams = false` para que un slug inexistente dé 404 real en lugar de intentar renderizar bajo demanda.

Recordatorio de la ruptura de Next 15+: `params` y `searchParams` son promesas y hay que await-earlas en cada página y `generateMetadata`.

*Alternativa descartada:* idioma por defecto sin prefijo (`/posts` en inglés, `/es/posts`). Da URLs más limpias pero duplica los casos borde en el switcher, en las alternativas `hreflang` y en el sitemap, para un sitio cuyo público es bilingüe desde el primer día.

### 4. Forma del contenido: MDX para prosa, YAML por idioma para listas

Dos formas, una regla clara para elegir:

| Tipo | Formato | Ruta |
|---|---|---|
| `posts`, `projects` | un MDX por pieza y por idioma | `content/posts/{locale}/{slug}.mdx` |
| `books`, `setup`, `achievements`, `community` | un YAML de lista por idioma | `content/{tipo}/{locale}.yml` |
| perfil del autor | un YAML por idioma | `content/profile/{locale}.yml` |

`books` y `setup` no llevan cuerpo MDX: son listas puras. `books` declara por libro su portada, su título y su autor (estos dos solo para la alternativa textual) y su estado de lectura, uno de tres valores cerrados. `setup` declara el bloque de hardware como pares etiqueta/valor y los demás bloques como categorías con una lista de entradas, cada una con nombre y logotipo opcional.

El idioma sale de la ruta del archivo, nunca de un campo que se pueda olvidar. Las piezas con cuerpo largo comparten `slug` entre idiomas; ese slug es el que aparece en la URL, idéntico en ambos.

*Alternativa descartada:* un solo archivo por pieza con los campos traducidos dentro (`title: {en, es}`). Es cómodo para listas cortas, pero mezcla idiomas en un mismo archivo, complica el diff de una traducción y no escala a un cuerpo de artículo.

*Trade-off:* traducir una lista implica editar dos archivos. Aceptable: son listas cortas y de baja rotación.

### 5. Política de traducción ausente, por tipo

Explícita porque la spec la exige y afecta a lo que ve el visitante:

- `posts` y `projects`: sin fallback. Si el slug no existe en ese idioma, la ruta no se genera y responde 404. El switcher, al detectar que la traducción no existe, lleva al índice de esa sección en el idioma elegido con un aviso.
- Listas y perfil: si falta el YAML de un idioma, la sección muestra su estado vacío traducido. La compilación no falla.

*Alternativa descartada:* servir la versión en el otro idioma como fallback silencioso. Mezcla idiomas sin que el visitante lo sepa y contamina las alternativas `hreflang`.

### 6. Render de MDX con lista de componentes explícita

Velite compila el MDX a un cuerpo de función; se renderiza con un componente `<Mdx>` que recibe un mapa de componentes permitidos.

**Decisión:** el mapa es explícito y compartido: elementos base (encabezados, enlaces, imágenes, tablas, código) más los componentes interactivos habilitados para posts. Cadena de plugins: `rehype-slug` + `rehype-autolink-headings` para las anclas y `rehype-pretty-code` (Shiki) para el resaltado, con un tema alineado al del sitio. El resaltado ocurre en build; no se envía Shiki al cliente.

Un componente no registrado hace fallar el build (requisito de la spec de blog), no se degrada a HTML silencioso.

### 7. Imágenes: Cloudinary detrás de un componente propio

El frontmatter guarda un `publicId`, no una URL. Todo el consumo pasa por un componente `<CloudImage>` propio que envuelve `CldImage` y fija por defecto el `alt` obligatorio, las dimensiones y el `sizes`.

*Motivo:* si mañana se cambia de proveedor o se pasa a imágenes locales, se toca un componente y un campo de esquema, no cada página. También evita que se cuele un `<img>` suelto.

`next.config.ts` declara `images.remotePatterns` para el host de Cloudinary. Se requiere `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` y `NEXT_PUBLIC_SITE_URL`; el arranque falla con un mensaje claro si faltan.

### 8. Logos de marca: svgl instalado, no dibujado

Los logos de la intro, de las cards de proyecto y del stack se instalan con `pnpm dlx shadcn@latest add @svgl/<nombre>` en `components/ui/svgs/`. Un mapa `logo-registry.ts` traduce el identificador que aparece en el frontmatter (`"nextjs"`, `"supabase"`) al componente y a su variante clara/oscura. Un identificador **desconocido** falla en build; un identificador **ausente** es válido y la entrada se muestra solo como texto — es el caso de las entradas de setup sin marca (`Dark 2026`, `JetBrains Mono`). Ausente y desconocido son casos distintos y no deben confundirse.

*Motivo:* el contenido referencia logos por nombre; sin registro central, cada página acabaría con su propio `switch`.

### 9. Un solo tema, sin capa de theming

El sitio se publica **solo en oscuro**. No hay conmutador, no hay paleta clara y no se respeta `prefers-color-scheme`: la decisión es de diseño, no una preferencia del visitante.

**Decisión:** los tokens (color, tipografía, radios, bordes) se definen una sola vez en `:root` en `app/globals.css` con la sintaxis de Tailwind 4, junto a `color-scheme: dark`. No se instala `next-themes` ni ningún proveedor de tema: sin estado de tema no hay destello inicial que evitar ni hidratación que suprimir.

El elemento raíz conserva la clase `dark` como **marcador constante**, no como conmutador: los componentes que genera el CLI de shadcn traen variantes `dark:` que solo resuelven bajo esa clase, y sin ella se verían con sus estilos claros sobre el fondo oscuro.

Dos familias: mono (nav, títulos de sección, metadatos) y sans (prosa). Un único color de acento.

*Consecuencias en el resto del diseño:*
- El registro de logos (decisión 8) mapea cada marca a **un** componente, el que se lee sobre fondo oscuro, en lugar de a un par claro/oscuro.
- El resaltado de código (decisión 6) usa **un** tema de Shiki. El modo de tema dual emite `--shiki-light`/`--shiki-dark` como custom properties en vez de colores, y exige CSS adicional que aquí no hace falta.

*Alternativa descartada:* mantener la paleta clara definida "por si acaso". Sería código que nunca se prueba ni se mira, y que se desincroniza a la primera que cambie un token.

### 10. Metadata, sitemap y feed derivados del mismo módulo de contenido

`generateMetadata` en cada ruta, con `alternates.languages` construido a partir de la existencia real de la traducción (decisión 5). `app/sitemap.ts` y `app/robots.ts` usan los convenios de archivo de Next. El feed se sirve como Route Handler por idioma (`app/[locale]/feed.xml/route.ts`) generado desde la misma colección `posts`, y se anuncia con `<link rel="alternate">` en las páginas del blog.

*Motivo:* una sola fuente. Si un post está en borrador, desaparece a la vez del índice, del sitemap y del feed, sin listas paralelas que se desincronicen.

Las imágenes OG se generan con `opengraph-image.tsx` e `ImageResponse` por ruta, con una plantilla común.

### 11. Fases y orden de ejecución

Cada fase deja el sitio compilando y navegable:

1. **Base** — Velite + scripts, `i18n/routing`, `proxy.ts`, `app/[locale]/layout.tsx`, tokens y tipografía, nav y footer con datos de prueba.
2. **Home** — perfil, secciones del mockup, estados vacíos.
3. **Proyectos** — índice y detalle.
4. **Blog** — índice, detalle, MDX, etiquetas.
5. **Secciones restantes** — Books, Setup, Community, Achievements.
6. **SEO/RSS/OG** — metadata, alternates, sitemap, robots, feed, OG, datos estructurados.

La fase 1 es la única que bloquea a todas las demás.

## Risks / Trade-offs

- **Velite fuera del ciclo de vida de Next** → un fallo de contenido aparece en otra terminal y el build de Next puede arrancar con datos viejos. Mitigación: `build` encadena `velite &&` de forma estricta, y `.velite/` se ignora en git para que nunca se sirva salida obsoleta desde el repo.
- **`proxy.ts` es un convenio nuevo y la documentación de next-intl aún habla de `middleware.ts`** → riesgo de seguir una guía desactualizada. Mitigación: la fase 1 incluye verificar en `node_modules/next/dist/docs/` antes de escribir el archivo, y una comprobación manual de que `/` redirige y `/es/...` responde 200.
- **Duplicación de contenido entre idiomas** → el sitio puede quedar desbalanceado, con secciones vacías en español. Mitigación: los estados vacíos son parte de la spec, no un caso de error; el sitio se ve correcto con contenido parcial.
- **Dependencia de Cloudinary para que el sitio se vea completo** → sin la variable de entorno no hay imágenes. Mitigación: el componente `<CloudImage>` centraliza el cambio y las imágenes fallan de forma contenida, no rompen el layout.
- **Ocho capacidades en un solo cambio** → propuesta grande. Mitigación: fases independientes y specs separadas por capacidad, para poder archivar y retomar por partes.
- **Resaltado de código con Shiki en build** → aumenta el tiempo de compilación conforme crezcan los posts. Aceptable mientras el blog sea pequeño; se revisará si el build se vuelve lento.

## Migration Plan

No hay usuarios ni contenido previo que migrar: el sitio no está publicado y lo que se borra es el template. El único movimiento destructivo es eliminar `app/page.tsx` y sustituirlo por la estructura `app/[locale]/`, en la fase 1 y en un solo commit.

## Open Questions

- Dominio y URL canónica definitiva para `NEXT_PUBLIC_SITE_URL` (se puede fijar en la fase 6, no antes).
- Plataforma de despliegue y si se activa analítica. No afecta a ninguna spec.
