# site-shell Specification

## Purpose
Define el marco común que rodea a todas las páginas —navegación, pie, tema y sistema visual— para que el sitio se vea y se comporte como una sola pieza y cualquier página nueva herede ese marco sin trabajo adicional.
## Requirements
### Requirement: Navegación global
Toda página DEBE mostrar una navegación superior con enlaces a Home, Projects, Books, Setup y Posts, más el control de idioma. La navegación DEBE señalar la sección activa e incluir el resto de secciones como enlaces reales navegables.

#### Scenario: Sección activa señalada
- **WHEN** el visitante está en cualquier página bajo `/en/projects`
- **THEN** la navegación marca "Projects" como activo de forma perceptible visualmente y expuesta a tecnologías de asistencia

#### Scenario: Navegación por teclado
- **WHEN** el visitante recorre la navegación con el tabulador
- **THEN** cada enlace y el control de idioma reciben foco en orden con un indicador de foco visible

#### Scenario: Navegación en pantallas estrechas
- **WHEN** el sitio se ve en una pantalla de móvil
- **THEN** todos los destinos de la navegación siguen siendo alcanzables sin desbordamiento horizontal de la página

### Requirement: Pie de página
Toda página DEBE mostrar un pie con dos grupos de enlaces, "Social" y "Community", cada uno con su encabezado y sus enlaces externos. Los enlaces externos DEBEN abrirse de forma segura y ser distinguibles como externos.

#### Scenario: Enlace externo seguro
- **WHEN** el visitante activa un enlace del pie que apunta fuera del sitio
- **THEN** se abre sin exponer la página de origen a la página destino

#### Scenario: Enlaces con nombre accesible
- **WHEN** un lector de pantalla recorre el pie
- **THEN** cada enlace anuncia a qué red o comunidad apunta, no solo el icono

### Requirement: Tema visual
El sitio DEBE presentarse siempre en tema oscuro y DEBE definir su color, tipografía y espaciado como tokens reutilizables. NO DEBE ofrecer un tema claro ni seguir la preferencia de esquema de color del sistema del visitante.

#### Scenario: Carga sin destello
- **WHEN** un visitante carga cualquier página por primera vez
- **THEN** la página se pinta directamente en oscuro, sin un cambio de color visible tras la hidratación

#### Scenario: Sistema en modo claro
- **WHEN** el visitante tiene su sistema en esquema de color claro
- **THEN** el sitio se muestra igualmente en oscuro

#### Scenario: Contraste suficiente
- **WHEN** se evalúa el texto del sitio sobre su fondo
- **THEN** el texto de cuerpo y los controles cumplen como mínimo el contraste AA de WCAG 2.1

### Requirement: Sistema tipográfico y de composición
El sitio DEBE aplicar de forma consistente una tipografía monoespaciada para la navegación y los títulos de sección y una tipografía de texto para la prosa, con un color de acento único para los remates destacados. El contenido DEBE presentarse en una columna central de ancho legible acotado.

#### Scenario: Ancho de línea acotado
- **WHEN** se ve cualquier página en una pantalla ancha
- **THEN** la columna de contenido permanece centrada y acotada a un ancho legible en lugar de estirarse a todo el viewport

#### Scenario: Jerarquía de encabezados coherente
- **WHEN** se inspecciona la estructura de encabezados de cualquier página
- **THEN** existe un único encabezado de primer nivel y los niveles descienden sin saltos

### Requirement: Estados de error y de carga
El sitio DEBE ofrecer una página de "no encontrado" y una de error dentro del mismo marco, en el idioma activo, con una salida clara hacia el home o el listado relevante.

#### Scenario: URL inexistente bajo un idioma válido
- **WHEN** el visitante abre `/es/posts/no-existe`
- **THEN** ve una página 404 en español, con la navegación y el pie del sitio, y un enlace al índice del blog

### Requirement: Movimiento respetuoso
Cualquier animación de interfaz DEBE respetar la preferencia de movimiento reducido del sistema del visitante.

#### Scenario: Movimiento reducido activo
- **WHEN** el visitante tiene activada la preferencia de movimiento reducido
- **THEN** las animaciones decorativas se suprimen o se reducen a un cambio instantáneo, sin perder ninguna información

