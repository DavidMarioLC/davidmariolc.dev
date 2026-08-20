## Why

El spec de `blog` ya promete que un post puede embeber "animaciones explicativas de un concepto", pero ese componente no existe: `<ConceptAnimation>` es hoy un placeholder que el skill `blog-post` deja en los borradores y que **rompe el build** si alguien lo escribe, porque no está en la allowlist de `mdxComponents`. El skill `concept-animation` ya define el contrato completo (pasos, controles, identidad visual, convenciones de SVG) y no puede generar una sola animación hasta que el andamiaje exista en el repositorio.

## What Changes

- Se añade `gsap` y `@gsap/react` como dependencias de producción.
- Se crea `components/mdx/concept-animation.tsx`: un wrapper reutilizable que aporta el chrome común a toda animación conceptual —título, franja con el texto del paso actual, controles Anterior / Siguiente / Reproducir / Reiniciar e indicador "paso X de N"— y navega por labels de una timeline de GSAP.
- Se establece la convención de que cada animación vive en `components/mdx/animations/<slug>.tsx` y se declara en un registro explícito, `components/mdx/animations/registry.ts`. Ese registro es a las animaciones lo que `mdxComponents` es a los componentes: un id no registrado detiene la compilación nombrando el id, en lugar de fallar en el navegador.
- Se difiere la carga: solo el wrapper se pre-renderiza; el archivo de la animación y GSAP viajan en un chunk aparte con `ssr: false` y un skeleton que reserva altura, siguiendo el patrón que ya usa `Playground`.
- Se respeta `prefers-reduced-motion`: con la preferencia activa los pasos siguen siendo navegables pero se salta a ellos sin interpolación, y "Reproducir" queda deshabilitado.
- Se registra `ConceptAnimation` en la allowlist de `components/mdx/mdx-components.tsx`, quedando disponible para posts y proyectos sin imports.
- Se añaden las claves de interfaz de los controles a `messages/en.json` y `messages/es.json`.
- Se incluye una primera animación real, `model-router`, que valida el andamiaje de punta a punta en vez de dejarlo sin ningún consumidor.

No es un objetivo de este cambio escribir animaciones para posts existentes ni retocar el skill `blog-post`.

## Capabilities

### New Capabilities

Ninguna. El comportamiento cae dentro del blog, que ya declara el embebido de componentes interactivos.

### Modified Capabilities

- `blog`: la capability gana requirements nuevas para las animaciones conceptuales —navegación por pasos con estado consistente en ambos sentidos, respeto de `prefers-reduced-motion`, fallo en compilación ante un identificador de animación desconocido, coste acotado al post que las usa y lectura en pantalla estrecha— que hoy no están especificadas. La requirement existente "Componentes interactivos embebidos" no cambia: estas se suman a ella.

## Impact

- **Dependencias**: `gsap` y `@gsap/react` nuevos en `package.json`. GSAP no entra en el bundle compartido: solo lo descarga quien abre un post que anima algo.
- **Código nuevo**: `components/mdx/concept-animation.tsx`, `components/mdx/animations/registry.ts`, `components/mdx/animations/model-router.tsx`.
- **Código modificado**: `components/mdx/mdx-components.tsx` (una entrada en la allowlist), `messages/en.json` y `messages/es.json` (claves de los controles; `pnpm check:messages` exige paridad), y los estilos globales del artículo para las clases del wrapper.
- **Documentación**: `.claude/skills/concept-animation/SKILL.md` marca hoy este andamiaje como "prerrequisito pendiente" y describe el estado inicial del SVG asumiendo render en servidor; ambas cosas dejan de ser ciertas al cerrar este cambio y hay que ajustarlas.
- **Sin impacto** en rutas, en el esquema de contenido de Velite ni en el frontmatter: un post que no use el componente compila y se sirve exactamente igual.
