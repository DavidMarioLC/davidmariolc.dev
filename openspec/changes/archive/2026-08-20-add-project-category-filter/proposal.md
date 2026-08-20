## Why

Cada proyecto ya declara una categoría (`web-app`, `api`, `tooling`…), pero el índice de proyectos los presenta como una lista plana: un visitante que busca trabajo de frontend tiene que abrir uno por uno para saber de qué tipo es cada cosa. La categoría es el eje por el que alguien filtra un portafolio, y hoy es un dato muerto en el contenido.

El precedente ya existe en el repo: las etiquetas del blog tienen su propia ruta pre-renderizada en `/{locale}/posts/tags/{tag}`. Esta capacidad aplica ese mismo patrón a las categorías de proyecto, en vez de introducir un filtrado en cliente que el sitio no usa en ninguna otra parte.

## What Changes

- Nueva ruta `/{locale}/projects/categories/{category}` que lista los proyectos publicados de una categoría en ese idioma, pre-renderizada en la compilación para las categorías que tienen al menos un proyecto.
- El índice de proyectos gana una fila de enlaces a esas categorías, mostrando únicamente las que tienen proyectos publicados en ese idioma.
- La categoría que ya se muestra en `ProjectMeta` pasa a ser un enlace a su página de categoría, tanto en el detalle del proyecto como en las tarjetas del índice y del home.
- El sitemap incluye una entrada por categoría con proyectos e idioma.
- Los catálogos de mensajes ganan el título de la página de categoría y el enlace de vuelta al índice.
- Sin campos nuevos de contenido: `category` ya existe en el esquema de Velite y es obligatorio.

## Capabilities

### New Capabilities

Ninguna. La navegación por categoría es una extensión del índice de proyectos, no una capacidad separada.

### Modified Capabilities

- `projects`: el índice gana navegación por categoría, y aparece un tipo de página nuevo — el listado por categoría — con sus reglas de pre-renderizado y de categoría inexistente.

## Impact

- **Rutas**: nueva `app/[locale]/projects/categories/[category]/page.tsx`. La ruta hermana `/{locale}/projects/{slug}` deja de poder usar `categories` como slug de proyecto; es un slug que nadie usa hoy y el segmento literal tiene precedencia en Next.
- **Componentes**: `components/site/project-meta.tsx` (categoría enlazada), `app/[locale]/projects/page.tsx` (fila de categorías).
- **Datos**: `lib/content.ts` gana las funciones de consulta por categoría, junto a las de etiquetas que ya existen.
- **Metadatos**: `app/sitemap.ts`.
- **i18n**: `messages/en.json` y `messages/es.json`; `pnpm check` valida la paridad entre ambos.
- **Contenido**: ninguno. Con `content/projects/` vacío la fila de categorías no se renderiza y no se genera ninguna ruta de categoría, así que el cambio es invisible hasta que se publique el primer proyecto.
