---
name: commit
description: Crea commits siguiendo Conventional Commits en este repo. Úsalo cuando el usuario pida "haz commit", "commitea esto", "guarda los cambios en git" o invoque /commit. Analiza el diff, agrupa cambios relacionados y escribe mensajes en el formato tipo(scope): descripción.
user-invocable: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git restore:*), Bash(git rev-parse:*), Bash(pnpm check:*), Bash(pnpm typecheck:*), Bash(pnpm build:*), Bash(pnpm dlx ultracite check:*), Bash(pnpm dlx ultracite fix:*)
---

# Commit

Crea commits limpios siguiendo [Conventional Commits](https://www.conventionalcommits.org/).

## Flujo

1. **Inspecciona el estado** en paralelo:
   - `git status --porcelain`
   - `git diff` (sin stage) y `git diff --cached` (con stage)
   - `git log --oneline -10` para imitar el estilo del historial
2. **Decide el alcance**:
   - Si el usuario ya hizo `git add`, respeta ese staging y commitea solo eso.
   - Si no hay nada en stage, agrega solo los archivos relevantes a lo que se pidió. Nunca uses `git add -A` a ciegas.
   - Si los cambios cubren varios propósitos independientes, propón **varios commits** y hazlos por separado.
3. **Verifica antes de commitear** (solo si el diff toca código, no para cambios de solo docs/config):
   - `pnpm check` — lint y formato con ultracite.
   - `pnpm typecheck` — errores de tipos.
   - `pnpm build` únicamente si el cambio toca rutas, `next.config`, o la config de Velite/MDX.

   Si algo falla, **no commitees**: reporta el error al usuario y pregunta si lo arregla él o lo arreglas tú.
4. **Escribe el mensaje** (ver formato abajo) y commitea con heredoc:
   ```sh
   git commit -m "$(cat <<'EOF'
   feat(blog): add pagination to the post list
   EOF
   )"
   ```
5. **Confirma** con `git status` que el commit se creó. El hook `pre-commit` corre `lint-staged` → `ultracite fix`; si reformatea archivos y el commit falla, revisa los cambios, vuelve a agregarlos y reintenta **una sola vez**. Si vuelve a fallar, reporta el error al usuario.

## Formato del mensaje

```
tipo(scope): descripción en inglés, imperativo, minúscula, sin punto final

[cuerpo opcional en inglés: el porqué, no el qué]

[footer opcional: BREAKING CHANGE: ... / Refs: #123]
```

### Tipos permitidos

| Tipo | Uso |
| --- | --- |
| `feat` | Nueva funcionalidad para el usuario |
| `fix` | Corrección de un bug |
| `docs` | Solo documentación (README, MDX, comentarios) |
| `style` | Formato sin cambio de lógica |
| `refactor` | Cambio interno sin nueva feature ni fix |
| `perf` | Mejora de rendimiento |
| `test` | Tests |
| `build` | Build, dependencias, bundler |
| `ci` | Configuración de CI |
| `chore` | Tareas varias (configs, tooling, husky, biome) |
| `revert` | Revierte un commit anterior |

### Scope

Opcional pero preferido. Usa el área del proyecto: `blog`, `ui`, `mdx`, `seo`, `deps`, `config`, `home`. Omítelo si el cambio es transversal.

### Reglas

- Idioma: **inglés**, siempre — asunto, cuerpo y footer. Aunque la conversación con el usuario sea en español.
- Modo imperativo: "add", no "added" ni "adds" ni "adding".
- Primera línea ≤ 72 caracteres.
- Un commit = un propósito. Si necesitas la palabra "y" para describirlo, probablemente son dos commits.
- El cuerpo explica **por qué** se hizo el cambio, en líneas ≤ 100 caracteres.
- Breaking changes: `!` tras el scope (`feat(api)!: ...`) **y** footer `BREAKING CHANGE: <explicación>`.

### Ejemplos

```
feat(blog): add table of contents to posts
fix(mdx): correct syntax highlighting in nested code blocks
chore(config): migrate from eslint + prettier to biome
docs: document the deployment flow in the README
refactor(ui)!: rename Card to PostCard

BREAKING CHANGE: `Card` imports must be updated to `PostCard`.
```

## Restricciones

- **No hagas `push`** salvo que el usuario lo pida explícitamente.
- No agregues coautoría ni firmas al mensaje salvo que el usuario lo pida.
- No uses `--no-verify` ni `--amend` sin permiso explícito del usuario.
- No modifiques archivos del working tree para "arreglar" el commit; commitea lo que hay.
- Nunca commitees secretos, `.env` ni archivos ignorados forzados con `-f`.
