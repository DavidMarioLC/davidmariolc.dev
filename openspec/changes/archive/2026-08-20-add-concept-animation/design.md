## Context

Ver `proposal.md` — Why. Lo que condiciona el diseño es el estado actual del repo:

- El cuerpo de un post se compila con Velite y se renderiza contra **una allowlist explícita**, `mdxComponents` en `components/mdx/mdx-components.tsx`. Una etiqueta no registrada no cae a un tag desconocido: rompe el build, y es deliberado.
- Ya existe un precedente para embeber algo pesado: `components/mdx/playground/playground.tsx` carga Sandpack con `next/dynamic` y `ssr: false` tras un skeleton que reserva altura, y documenta que el wrapper cliente delgado existe justamente porque `ssr: false` solo es legal dentro de un componente cliente.
- Todas las páginas de post se pre-renderizan en la compilación (requirement "Páginas de post pre-renderizadas"), así que **lanzar un error al renderizar equivale a romper el build**. `MdxImage` ya explota esa propiedad para rechazar la sintaxis de imagen de markdown con un mensaje útil.
- Los textos de interfaz pasan por `next-intl` y `pnpm check:messages` exige paridad entre `messages/en.json` y `messages/es.json`.
- El contrato de la animación (pasos, controles, convenciones de SVG, tokens visuales) ya está escrito en `.claude/skills/concept-animation/SKILL.md`, con implementaciones de referencia en `examples/`. Este diseño lo implementa; no lo redefine.

## Goals / Non-Goals

**Goals:**

- Un solo andamiaje: toda animación futura se escribe como un archivo autocontenido y no reinventa controles, navegación ni estado.
- Que el error barato (un id mal escrito) se pague en la compilación y no en producción.
- Que el coste de GSAP lo pague solo el post que anima algo.

**Non-Goals:**

- No se generaliza a otros tipos de contenido interactivo. Si mañana hace falta una exploración con controles en lugar de pasos, es otro componente y otro cambio.
- No se abstrae el diagrama. Cada animación escribe su propio SVG a mano; intentar un motor de diagramas genérico es lo que convierte esto en un proyecto en vez de una utilidad.
- No se persiste el paso en la URL ni en el historial.

## Decisions

### La timeline es el estado; React solo lleva el índice

Cada animación exporta una función pura `buildTimeline(root: SVGSVGElement): gsap.core.Timeline` que construye una timeline pausada con **un label por paso**. Navegar es `tweenTo(label)`; React solo guarda qué índice está activo, para pintar el texto y el indicador.

*Por qué:* dos fuentes de verdad para "en qué paso estamos" es la forma segura de que el diagrama y el texto se desincronicen al navegar hacia atrás. Con la timeline como única fuente, cualquier estado visual es función del tiempo de la timeline y retroceder es gratis.

*Alternativa descartada:* estado en React y un `useEffect` que dispara tweens por paso. Cada tween tendría que saber revertirse, y la reversión a mano es exactamente el bug que la requirement "Retroceder deja el diagrama consistente" describe.

Dos consecuencias de esto son obligatorias al escribir una timeline y deben quedar documentadas donde se escriben:

- El `addLabel` de un paso va **después** de sus tweens. Con el label antes, `tweenTo` se detiene justo antes de que el paso ocurra: cada control reproduce el paso anterior y el último no llega a correr nunca.
- Un paso que no aporta tweens propios necesita un hueco explícito de duración mínima antes de los suyos, o su label colapsa sobre el del paso anterior y la navegación se vuelve impredecible.

### El registro es la allowlist de las animaciones

`components/mdx/animations/registry.ts` mapea slug a un import perezoso. El wrapper valida el `id` contra ese objeto y lanza un `Error` con el mensaje de qué hacer si no está.

*Por qué:* replica el mecanismo que el repo ya eligió para los componentes MDX —una lista explícita, un fallo ruidoso en compilación— en vez de introducir un segundo modelo mental. Y como las páginas se pre-renderizan, el `throw` es un fallo de build sin necesitar un paso de validación aparte.

*Detalle que hace que funcione:* la validación del `id` vive en el wrapper externo, que **sí** se pre-renderiza; solo el interior lleva `ssr: false`. Si el chequeo se metiera dentro del componente diferido, un id inválido se convertiría en un error de navegador y la requirement "Identificador desconocido" no se cumpliría.

*Alternativa descartada:* `import(\`./animations/${id}\`)` sin registro. Ahorra un archivo, pero el bundler tiene que preparar un chunk por cada archivo del directorio y el id inválido solo falla en el cliente.

*Alternativa descartada:* registrar cada animación directamente en `mdxComponents` y escribir `<ModelRouterAnimation />`. Es el mecanismo más simple y detecta el typo sin inventar nada, pero hace crecer la allowlist global una entrada por animación y obliga a cambiar el placeholder que ya emite el skill `blog-post`.

### Carga diferida completa, con skeleton

El wrapper se pre-renderiza; el archivo de la animación —SVG incluido— y GSAP viajan en un chunk cargado con `next/dynamic` y `ssr: false`, tras un skeleton que reserva altura.

*Por qué:* es el patrón ya establecido por `Playground` para exactamente el mismo problema, y mantiene GSAP fuera del bundle de los posts que no animan nada.

*Trade-off aceptado:* sin JavaScript no hay diagrama. Se descarta la alternativa de pre-renderizar el SVG y diferir solo GSAP, que degradaría a un diagrama estático completo, porque partiría cada animación en dos archivos y rompería la regla de "un archivo autocontenido por animación" que hace barato escribirlas.

### `prefers-reduced-motion` decide cómo se llega al paso, no si se llega

La preferencia se lee dentro del efecto —en el servidor no hay `window`— y cambia `tweenTo` por `seek`. Los pasos, los textos y el diagrama son idénticos.

*Por qué:* la animación **es** la explicación. Ocultarla o sustituirla por un resumen le quita contenido a quien pidió menos movimiento, no ruido. Solo "Reproducir" se deshabilita, porque su único propósito es el movimiento continuo.

### Por debajo de su ancho mínimo el diagrama se desplaza, no encoge

Un `viewBox` fijo que escala con el contenedor encoge el texto en la misma proporción: a 375px el diagrama renderiza a 293px y una etiqueta de 13 unidades queda en 5.3px reales. Así que el SVG lleva un `min-width` y, por debajo de él, la escena hace scroll horizontal dentro de su propio contenedor, que es una región enfocable y con nombre.

*Por qué:* es el contrato que el blog ya eligió para el contenido ancho — `.table-wrapper` hace exactamente esto con las tablas. El lector desplaza el diagrama; nunca se le da un diagrama ilegible que técnicamente cabe.

*Alternativa descartada:* subir el `font-size` del texto del SVG bajo un breakpoint. Nada desborda, pero el texto crece respecto a las cajas que lo contienen y hay que revisar a mano cada nodo de cada animación.

*Alternativa descartada:* un segundo SVG vertical para móvil. Mejor resultado visual, pero dobla el trabajo de cada animación y rompe la regla de un archivo autocontenido.

### Estilos en CSS global, no en clases de utilidad por animación

El chrome del wrapper (`concept-animation`, `-stage`, `-caption`, `-controls`, `-indicator`) se estiliza en la hoja global del artículo, junto a las clases de `Challenge` y `Callout`.

*Por qué:* es donde el repo ya pone el estilo de los componentes de artículo, y deja el archivo de cada animación conteniendo solo el SVG y su timeline.

## Risks / Trade-offs

- **La animación no existe sin JavaScript** → Aceptado conscientemente arriba. El post debe seguir siendo comprensible sin ella: el skill ya obliga a que la animación acompañe a una explicación en prosa, no que la sustituya.
- **GSAP es una dependencia grande y viva** → Acotada a su propio chunk y a un único punto de importación. Si algún día hay que cambiar de motor, el contrato `buildTimeline` es lo único que las animaciones conocen.
- **El registro se puede olvidar** → El fallo es en compilación y el mensaje dice el archivo exacto a editar. Es el modo de fallo barato.
- **Los bugs de timeline solo aparecen al navegar hacia atrás** → Por eso el checklist de validación exige recorrer los pasos en ambos sentidos, dos vueltas, y no basta con verla correr hacia adelante.
- **DrawSVG y los trazos punteados son incompatibles en el mismo path** → DrawSVG reescribe `stroke-dasharray` para producir su efecto, así que una arista declarada punteada se dibuja sólida en cuanto se anima. La convención "punteada = condicional" solo vale para aristas que DrawSVG no toca; queda documentado en el skill.
- **`.claude/skills/concept-animation/` queda desactualizado al cerrar este cambio** → Está en las tareas: el prerrequisito deja de estar pendiente y la nota sobre el render en servidor del SVG deja de ser cierta con `ssr: false`.

## Migration Plan

No aplica: no hay contenido existente que use el componente. Un post que no lo embeba compila y se sirve igual que antes, y revertir el cambio es quitar las dependencias, los archivos nuevos y la entrada de la allowlist.
