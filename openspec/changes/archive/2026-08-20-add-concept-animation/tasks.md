## 1. Dependencias

- [x] 1.1 Instalar `gsap` y `@gsap/react` con `pnpm add gsap @gsap/react`
- [x] 1.2 Verificar que no se ha generado ningún `.npmrc` ni referencia a `npm.greensock.com`: los plugins de Club son gratuitos desde el paquete público y el registry privado está obsoleto
- [x] 1.3 Comprobar que `pnpm install` funciona desde limpio (`rm -rf node_modules && pnpm install`)

## 2. Wrapper `ConceptAnimation`

- [x] 2.1 Crear `components/mdx/concept-animation.tsx` como componente cliente, partiendo de `.claude/skills/concept-animation/examples/concept-animation.tsx`
- [x] 2.2 Definir y exportar los tipos del contrato: `ConceptStep` (`id`, `label`, `text`) y las props del wrapper
- [x] 2.3 Montar la timeline con `useGSAP` scopeado al contenedor, con cleanup al desmontar
- [x] 2.4 Implementar la navegación Anterior / Siguiente con `tweenTo(label)` y el indicador "paso X de N"
- [x] 2.5 Implementar Reiniciar (vuelve al primer paso) y Reproducir (recorre de principio a fin actualizando texto e indicador conforme pasa por cada label)
- [x] 2.6 Hacer que navegar durante la reproducción la interrumpa y deje la animación en el paso pedido, sin estados intermedios
- [x] 2.7 Deshabilitar Anterior en el primer paso y Siguiente en el último
- [x] 2.8 Leer `prefers-reduced-motion` dentro del efecto (nunca en el render: en SSR no hay `window`) y usar `seek` en vez de `tweenTo` cuando esté activa, deshabilitando Reproducir
- [x] 2.9 Añadir la semántica de accesibilidad: controles como `<button>` con nombre accesible y la franja del paso como `aria-live="polite"`

## 3. Registro y carga diferida

- [x] 3.1 Crear `components/mdx/animations/registry.ts` con el mapa de slug a import perezoso
- [x] 3.2 Validar el `id` contra el registro **en el wrapper externo pre-renderizado**, lanzando un `Error` que nombre el id y el archivo donde declararlo
- [x] 3.3 Cargar el archivo de la animación con `next/dynamic` y `ssr: false`, siguiendo el patrón de `components/mdx/playground/playground.tsx`
- [x] 3.4 Añadir el skeleton que reserva la altura de la animación y anuncia la carga (`aria-busy`, `aria-live`), para que el texto de debajo no se desplace al llegar el chunk

## 4. Integración en el sitio

- [x] 4.1 Registrar `ConceptAnimation` en el objeto `mdxComponents` de `components/mdx/mdx-components.tsx`
- [x] 4.2 Añadir las claves `conceptAnimation` (`previous`, `next`, `play`, `restart`, `stepIndicator`, `diagramLabel`, `loading`) a `messages/es.json` y `messages/en.json`
- [x] 4.3 Verificar la paridad con `pnpm check:messages`
- [x] 4.4 Añadir los estilos del chrome (`concept-animation` y sus partes) a la hoja global del artículo, junto a los de `Challenge` y `Callout`, con los tokens de `.claude/skills/concept-animation/reference/design-tokens.md`

## 5. Primera animación: `model-router`

- [x] 5.1 Crear `components/mdx/animations/model-router.tsx` a partir de `.claude/skills/concept-animation/examples/model-router.tsx`
- [x] 5.2 Declararla en el registro con el slug `model-router`
- [x] 5.3 Comprobar que `addLabel` va después de los tweens de cada paso y que el paso sin tweens propios tiene su hueco de duración explícito
- [x] 5.4 Embeberla en un post de prueba local para ejercitar el camino completo de MDX a render

## 6. Validación

- [x] 6.1 `pnpm content` (Velite en `--strict`) y `pnpm typecheck` en verde
- [x] 6.2 `pnpm dlx ultracite fix` y `pnpm check` en verde
- [x] 6.3 Con `pnpm dev`, recorrer los pasos hacia adelante y hacia atrás dos veces: nada se acumula, retroceder devuelve el estado exacto
- [x] 6.4 Comprobar Reproducir de principio a fin, Reiniciar, y navegar en mitad de una reproducción
- [x] 6.5 Repetir a 375px de ancho: sin desbordes, texto legible, controles cómodos
- [x] 6.6 Repetir con movimiento reducido emulado (DevTools → Rendering → Emulate CSS media feature): los pasos saltan, Reproducir deshabilitado, contenido completo
- [x] 6.7 Recorrer la animación solo con teclado y comprobar que el cambio de paso se anuncia
- [x] 6.8 Verificar el fallo por id desconocido: cambiar el `id` del post de prueba por uno inexistente y confirmar que `pnpm build` falla nombrándolo
- [x] 6.9 Verificar en el network del navegador que un post sin animaciones no descarga GSAP ni ningún chunk de animación
- [x] 6.10 Recorrer `.claude/skills/concept-animation/reference/pedagogy-checklist.md`

## 7. Cierre

- [x] 7.1 Post de prueba `content/posts/es/router-de-modelos.mdx` conservado como borrador (`draft: true`), por decisión del usuario
- [x] 7.2 Actualizar `.claude/skills/concept-animation/SKILL.md`: el prerrequisito del wrapper deja de estar pendiente y pasa a describir lo que existe
- [x] 7.3 Corregida en `svg-conventions.md` la justificación del `gsap.set()` inicial (ya no es el SSR) y documentada la trampa nueva: DrawSVG reescribe `stroke-dasharray`, así que una arista punteada se dibuja sólida al animarse
- [x] 7.4 Actualizar el skill `blog-post`, que hoy advierte que `ConceptAnimation` no existe todavía
