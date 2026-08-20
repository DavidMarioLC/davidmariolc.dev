## Context

Ver `proposal.md` — Why. Restricciones del sitio que condicionan el enfoque:

- El sitio es estático: todas las rutas se generan en la compilación y `dynamicParams = false` convierte cualquier parámetro no generado en 404. No hay servidor que atienda un filtrado dinámico.
- Existe un precedente resuelto para el mismo problema: `app/[locale]/posts/tags/[tag]/page.tsx` lista posts por etiqueta con ruta propia, `generateStaticParams`, `notFound()` cuando la lista queda vacía y entrada en el sitemap.
- `category` es un slug obligatorio del esquema de Velite, con nueve valores cerrados. La etiqueta visible ya vive en `messages/{locale}.json`, y `pnpm check` exige paridad entre catálogos.
- `content/projects/` está vacío hoy: el cambio no será observable hasta que se publique el primer proyecto.

## Goals / Non-Goals

**Goals:**

- Una URL por categoría, compartible e indexable, sin JavaScript de cliente.
- Coherencia con el patrón de etiquetas del blog: quien lea uno de los dos entiende el otro.
- Ninguna categoría vacía visible en ninguna parte — navegación, rutas o sitemap.

**Non-Goals:**

- Filtrar por `type` (`real` / `learning`). Dos valores no justifican una ruta; si hace falta, se resuelve después con el mismo patrón.
- Combinar filtros (categoría + stack, categoría + tipo). El producto cartesiano de rutas estáticas no se paga con este volumen de contenido.
- Filtrado en cliente, orden configurable o buscador dentro del índice.

## Decisions

### Segmento de ruta en vez de parámetro de consulta

`/{locale}/projects/categories/{category}`, no `/{locale}/projects?category=…`.

Un parámetro de consulta sobre una página estática obliga a filtrar en cliente: JavaScript nuevo, contenido que no existe hasta la hidratación y una URL que Google no indexa como página propia. El segmento genera HTML real por categoría al compilar. Alternativa descartada: `nuqs` o `useSearchParams`, que el sitio no usa en ninguna otra parte.

El segmento literal `categories` tiene precedencia sobre la ruta hermana `[slug]`, así que a partir de este cambio ningún proyecto puede llamarse `categories`. Es un slug que nadie usa y el coste de reservarlo es cero.

### `categories` en plural, imitando `tags`

El blog ya expone `/posts/tags/{tag}`. Usar `/projects/categories/{category}` mantiene una sola convención en el sitio. Alternativa descartada: `/projects/category/{category}` en singular, que obligaría a recordar cuál de las dos formas usa cada sección.

### 404 para una categoría sin proyectos, no un listado vacío

Coherente con la ruta de etiquetas, que ya hace `notFound()` cuando la lista queda vacía. Una categoría del esquema sin proyectos publicados no es una página con cero resultados: es una página que no existe. Esto también deja fuera automáticamente las categorías cuyo único proyecto está en borrador, porque `getProjects` ya filtra los borradores fuera de producción.

### Las consultas viven en `lib/content.ts`

`getProjectsByCategory(locale, category)` y `getProjectCategories(locale)`, junto a `getPostsByTag` y `getTags`, que ya resuelven exactamente esta forma para el blog. La página, el sitemap y la fila de navegación leen de la misma fuente, así que no pueden discrepar sobre qué categorías existen.

### La navegación del índice es una lista de enlaces

Enlaces a las páginas de categoría, no botones con estado. Un control que parece un filtro interactivo pero navega a otra página miente sobre lo que hace; un enlace no.

## Risks / Trade-offs

- **Con pocos proyectos la navegación es ruido, y con uno por categoría cada página de categoría duplica el índice** → la fila solo muestra categorías con proyectos, así que crece con el contenido en vez de anticiparlo. Con menos de dos categorías pobladas no aporta nada; revisar entonces si conviene ocultarla del todo.
- **Contenido duplicado para los buscadores**: una categoría con un único proyecto genera una página casi idéntica al índice → el sitemap las incluye sin marcarlas como preferentes y las páginas de categoría no llevan `alternates` distintos de los del índice; si crece el problema, se puede añadir `robots: { index: false }` a las categorías con un solo proyecto.
- **`categories` queda reservado como slug de proyecto** → aceptado explícitamente arriba.
- **No se puede verificar el cambio hasta que exista contenido** → la implementación se valida publicando temporalmente proyectos de ejemplo en al menos dos categorías, comprobando las rutas generadas y el sitemap, y retirándolos después.

## Migration Plan

No aplica: no hay datos que migrar ni URLs que cambien. Las rutas nuevas aparecen cuando exista contenido, y quitar el cambio es revertir los archivos afectados.
