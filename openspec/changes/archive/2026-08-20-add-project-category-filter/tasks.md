## 1. Consultas de contenido

- [x] 1.1 Añadir `getProjectsByCategory(locale, category)` a `lib/content.ts`, filtrando sobre `getProjects` para que herede el filtrado de borradores y el orden declarado
- [x] 1.2 Añadir `getProjectCategories(locale)`, que devuelve solo las categorías con al menos un proyecto publicado en ese idioma, en orden estable entre compilaciones

## 2. Ruta de categoría

- [x] 2.1 Crear `app/[locale]/projects/categories/[category]/page.tsx` con `dynamicParams = false` y `generateStaticParams` sobre `getProjectCategories`, siguiendo `app/[locale]/posts/tags/[tag]/page.tsx`
- [x] 2.2 Renderizar el listado con `ProjectCard`, el título traducido de la categoría y el enlace de vuelta a `/projects`
- [x] 2.3 Llamar a `notFound()` cuando la categoría no tenga proyectos publicados en ese idioma
- [x] 2.4 Implementar `generateMetadata` con `pageMetadata`, declarando como `locales` solo los idiomas donde esa categoría tiene proyectos

## 3. Navegación

- [x] 3.1 Añadir la fila de enlaces de categoría al índice `app/[locale]/projects/page.tsx`, oculta cuando `getProjectCategories` devuelve una lista vacía
- [x] 3.2 Convertir la categoría de `components/site/project-meta.tsx` en un enlace a su página, usando el `Link` de `@/i18n/routing` para conservar el idioma
- [x] 3.3 Comprobar que `ProjectMeta` sigue funcionando dentro de `ProjectCard`, donde ya vive dentro de una tarjeta enlazable, sin anidar un enlace dentro de otro

## 4. Metadatos e i18n

- [x] 4.1 Añadir al sitemap una entrada por categoría con proyectos e idioma, junto al bloque de etiquetas de `app/sitemap.ts`
- [x] 4.2 Añadir a `messages/en.json` y `messages/es.json` el título de la página de categoría y el texto del enlace de vuelta al índice
- [x] 4.3 Verificar la paridad de catálogos con `pnpm check`

## 5. Verificación

- [x] 5.1 Publicar temporalmente proyectos de ejemplo en al menos dos categorías, una de ellas con dos proyectos y otra con uno
- [x] 5.2 Compilar y comprobar que se genera una ruta por categoría e idioma, que el listado muestra solo los proyectos de su categoría y que una categoría sin proyectos devuelve 404
- [x] 5.3 Comprobar que las categorías generadas aparecen en el sitemap y que ninguna categoría vacía lo hace
- [x] 5.4 Comprobar que un proyecto en borrador no genera ruta de categoría ni entrada de navegación
- [x] 5.5 Retirar el contenido de ejemplo y dejar `content/projects/` vacío
- [x] 5.6 Pasar `pnpm check`, `pnpm typecheck` y `pnpm build`
