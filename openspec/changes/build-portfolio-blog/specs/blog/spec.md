## Purpose

Define el blog técnico: cómo se listan los posts, cómo se lee uno, y qué garantías de legibilidad y navegación ofrece un artículo largo con código y elementos interactivos.

## ADDED Requirements

### Requirement: Índice del blog
El sitio DEBE ofrecer en `/{locale}/posts` un índice de los posts publicados en ese idioma, ordenados del más reciente al más antiguo, mostrando para cada uno su título, fecha, resumen y tiempo estimado de lectura.

#### Scenario: Orden cronológico inverso
- **WHEN** hay varios posts publicados
- **THEN** el más reciente aparece primero

#### Scenario: Índice sin posts
- **WHEN** no hay posts publicados en ese idioma
- **THEN** el índice muestra un estado vacío traducido en lugar de una página en blanco

### Requirement: Detalle de post
Cada post DEBE tener una página propia en `/{locale}/posts/{slug}` que muestre su título, fecha, tiempo de lectura, sus etiquetas y el cuerpo del artículo renderizado.

#### Scenario: Post inexistente
- **WHEN** el visitante abre un slug de post que no existe en ese idioma
- **THEN** recibe una página 404 del sitio con estado 404

#### Scenario: Tiempo de lectura derivado
- **WHEN** se publica un post
- **THEN** su tiempo estimado de lectura se calcula a partir de su cuerpo, sin que el autor tenga que escribirlo a mano

### Requirement: Render del cuerpo del artículo
El cuerpo de un post DEBE renderizarse con encabezados enlazables, bloques de código con resaltado de sintaxis, citas, listas, tablas, imágenes optimizadas y enlaces, con el sistema tipográfico del sitio.

#### Scenario: Encabezado enlazable
- **WHEN** el visitante activa el ancla de un encabezado del artículo
- **THEN** la URL apunta a ese encabezado y compartirla lleva a otro visitante a la misma posición

#### Scenario: Bloque de código legible
- **WHEN** un post incluye un bloque de código con lenguaje declarado
- **THEN** se muestra con resaltado de sintaxis, sin desbordar horizontalmente la página, y su texto se puede seleccionar y copiar

#### Scenario: Imagen dentro del artículo
- **WHEN** un post incluye una imagen
- **THEN** se sirve optimizada, con dimensiones reservadas para no desplazar el texto al cargar, y con su texto alternativo

### Requirement: Componentes interactivos embebidos
Un post DEBE poder embeber componentes interactivos propios del sitio —como animaciones explicativas de un concepto— dentro de su cuerpo, sin que ello afecte al render del resto del artículo.

#### Scenario: Componente embebido en un post
- **WHEN** un post referencia un componente interactivo permitido
- **THEN** el componente se renderiza en su posición dentro del artículo y el resto del texto se muestra con normalidad

#### Scenario: Componente desconocido
- **WHEN** un post referencia un componente que no existe
- **THEN** la compilación falla nombrando el post y el componente, en lugar de publicar un artículo roto

### Requirement: Etiquetas
Un post DEBE poder declarar etiquetas, mostrarlas en su detalle y en el índice, y el sitio DEBE permitir ver los posts que comparten una etiqueta.

#### Scenario: Filtrado por etiqueta
- **WHEN** el visitante activa una etiqueta de un post
- **THEN** ve la lista de posts publicados en ese idioma que llevan esa etiqueta

### Requirement: Páginas de post pre-renderizadas
Todas las páginas de post DEBEN generarse en la compilación para los idiomas en que estén publicadas y servirse como contenido estático.

#### Scenario: Todas las rutas generadas
- **WHEN** se compila el sitio
- **THEN** existe una ruta generada por cada combinación de post publicado e idioma en que exista
