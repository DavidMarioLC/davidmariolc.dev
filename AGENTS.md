<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Gestor de paquetes: pnpm (obligatorio)

Este proyecto usa **pnpm** exclusivamente. Nunca uses `npm`, `yarn` ni `bun` para instalar, actualizar o ejecutar scripts.

- Instalar dependencias: `pnpm install`
- Añadir dependencia: `pnpm add <pkg>` (dev: `pnpm add -D <pkg>`)
- Eliminar dependencia: `pnpm remove <pkg>`
- Ejecutar scripts: `pnpm <script>` (p. ej. `pnpm dev`, `pnpm build`)
- Ejecutar binarios sin instalar: `pnpm dlx <pkg>`

El único lockfile válido es `pnpm-lock.yaml`. Si aparece `package-lock.json`, `yarn.lock` o `bun.lockb`, bórralo y regenera con `pnpm install`.


# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm dlx ultracite fix` before committing to ensure compliance.

---

# Enrutamiento: OpenSpec vs. trabajo directo

Antes de escribir código, clasifica la petición. No empieces a editar archivos hasta haber hecho esta clasificación.

## Usa OpenSpec (`/opsx:propose`) si se cumple alguna:

- Introduce una capacidad nueva: sección del sitio, ruta, layout, feature de blog, integración externa.
- Toca 3+ archivos o cruza capas (contenido ↔ componentes ↔ config ↔ i18n).
- Cambia el esquema de contenido (`velite.config`, frontmatter de MDX) o la estructura de rutas/URLs.
- Afecta i18n de forma estructural: idioma nuevo, cambio de estrategia de routing, reorganización de claves.
- Los requisitos son ambiguos o hay más de un diseño razonable y la elección importa.
- El trabajo se hará en varias sesiones o quieres poder retomarlo con contexto.

## Ve directo (sin OpenSpec):

- Bug fix localizado en uno o dos archivos.
- Ajustes de estilos, spacing, colores, copy o traducciones de cadenas existentes.
- Refactor mecánico sin cambio de comportamiento (renombrar, extraer componente, mover archivo).
- Config, dependencias, tooling, scripts.
- Escribir o editar un post MDX con el esquema de contenido que ya existe.
- Animaciones de un solo componente (para eso ya están las skills `animate` / `concept-animation`).

## Ante la duda

Pregunta en una línea antes de empezar: *"Esto lo veo como candidato a OpenSpec por X — ¿lo propongo o lo hago directo?"* La salida por defecto es preguntar, **no** proponer un spec por si acaso. Una propuesta de OpenSpec para un cambio de 5 líneas es fricción, no rigor.

Si el usuario dice "hazlo directo", se hace directo — la clasificación es una recomendación, no un veto.

---

# Iconos

Dos fuentes, sin mezclarlas:

- **Logos de tecnologías y marcas** (React, Next.js, TypeScript, Tailwind, etc.): **svgl** — https://svgl.app. Es la única fuente para logos de marca; no dibujes SVGs a mano ni copies de otros sitios.
- **Iconos de interfaz** (flechas, menú, cerrar, sol/luna…): `lucide-react`, ya instalado y declarado como `iconLibrary` en `components.json`.

## svgl se instala con el CLI de shadcn

El registro `@svgl` ya está declarado en `components.json`:

```json
"registries": {
  "@svgl": "https://svgl.app/r/{name}.json"
}
```

Para añadir un logo (uno o varios de golpe):

```bash
pnpm dlx shadcn@latest add @svgl/react @svgl/nextjs
```

Nunca `npx`/`bunx`: en este repo el gestor es pnpm.

## Qué genera

- Los componentes caen en `components/ui/svgs/`, un archivo `.tsx` por variante: `reactLight.tsx`, `reactDark.tsx`, `reactWordmarkLight.tsx`, `reactWordmarkDark.tsx`…
- Cada componente es `(props: SVGProps<SVGSVGElement>)` con los colores de marca inline y **sin tamaño por defecto**: hay que pasar `className` (p. ej. `className="size-6"`) o `width`/`height` en el punto de uso.
- Son archivos generados: no los edites a mano. Si necesitas otra variante, instálala desde el registro.

## Reglas de uso

- Elige la variante `Light`/`Dark` según el tema, no fuerces colores con CSS sobre el logo. Con `next-themes` ya disponible, resuelve la variante en el componente que lo consume.
- Usa `Wordmark` solo cuando quepa el nombre completo; para grids de tecnologías, el icono suelto.
- Respeta la licencia/trademark de cada marca: se usan como referencia a la tecnología, sin modificar el logo.
- No hagas fetch en runtime a `api.svgl.app` ni cargues los logos con `<img>` remoto: todo va inline vía el CLI.
