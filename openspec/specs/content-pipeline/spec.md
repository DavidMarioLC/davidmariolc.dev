# content-pipeline Specification

## Purpose
Define cómo se declara, valida y consume el contenido del sitio (posts, proyectos, logros, comunidad, libros, setup y el perfil del autor) de forma tipada y por idioma, para que las páginas nunca lean archivos sueltos ni dependan de contenido malformado.
## Requirements
### Requirement: Contenido tipado en el repositorio
El sistema DEBE tratar los archivos de contenido versionados en el repositorio como la única fuente de verdad del sitio, validarlos contra un esquema declarado por tipo de contenido, y exponer el resultado como datos tipados en tiempo de compilación. Ninguna página DEBE leer el sistema de archivos en tiempo de ejecución.

#### Scenario: Contenido válido disponible para las páginas
- **WHEN** el proyecto se compila con archivos de contenido que cumplen su esquema
- **THEN** cada tipo de contenido queda disponible como una colección tipada, con los tipos derivados del esquema y sin `any`

#### Scenario: Frontmatter inválido detiene el build
- **WHEN** una pieza de contenido omite un campo obligatorio o usa un tipo incorrecto
- **THEN** la compilación falla con un error que nombra el archivo y el campo problemático, y no se genera una página con datos incompletos

### Requirement: Tipos de contenido soportados
El sistema DEBE soportar los tipos de contenido `posts`, `projects`, `achievements`, `community`, `books`, `setup` y un perfil de autor singleton. Cada tipo DEBE declarar los campos que sus páginas necesitan, incluyendo como mínimo: identificador estable, idioma, título, fecha o año cuando aplique, y los medios y enlaces que su presentación requiere.

#### Scenario: Un tipo nuevo no rompe los existentes
- **WHEN** se añade una pieza de contenido de cualquier tipo soportado
- **THEN** aparece en las páginas de ese tipo sin requerir cambios en el código de las páginas

#### Scenario: Perfil del autor como singleton
- **WHEN** el home solicita el perfil del autor para un idioma
- **THEN** obtiene exactamente un registro con nombre, avatar, país y los párrafos de la intro con sus enlaces y logos declarados

### Requirement: Resolución de contenido por idioma
Cada pieza de contenido DEBE declarar su idioma y compartir un identificador estable con sus traducciones. El sistema DEBE exponer una forma de obtener el contenido de un tipo filtrado por idioma, y DEBE ser determinista sobre qué ocurre cuando una pieza existe en un idioma pero no en el otro.

#### Scenario: Listado filtrado por idioma
- **WHEN** una página solicita las piezas de un tipo para el idioma `es`
- **THEN** recibe únicamente las piezas en `es`, ordenadas por su criterio declarado (fecha descendente cuando el tipo tiene fecha)

#### Scenario: Traducción ausente
- **WHEN** se solicita por slug una pieza que solo existe en el otro idioma
- **THEN** el sistema responde con la variante disponible marcada como no traducida, o con "no encontrada", según la política declarada para ese tipo — nunca mezclando idiomas dentro de una misma página sin señalarlo

### Requirement: Identificadores estables y unicidad
El sistema DEBE derivar de cada pieza un slug estable usado en su URL, y DEBE garantizar que no existan dos piezas del mismo tipo con el mismo slug e idioma.

#### Scenario: Slug duplicado
- **WHEN** dos piezas del mismo tipo e idioma resuelven al mismo slug
- **THEN** la compilación falla identificando ambos archivos

#### Scenario: El slug no cambia al editar el contenido
- **WHEN** se edita el cuerpo o el título visible de una pieza ya publicada sin cambiar su slug declarado
- **THEN** su URL permanece igual

### Requirement: Estado de publicación
El sistema DEBE permitir marcar una pieza como borrador. El contenido en borrador NO DEBE aparecer en listados, feeds ni sitemap en la compilación de producción.

#### Scenario: Borrador excluido en producción
- **WHEN** se compila para producción una pieza marcada como borrador
- **THEN** no aparece en ningún listado, feed ni sitemap públicos

#### Scenario: Borrador visible en desarrollo
- **WHEN** se ejecuta el sitio en desarrollo
- **THEN** las piezas en borrador son visibles para poder revisarlas antes de publicar

