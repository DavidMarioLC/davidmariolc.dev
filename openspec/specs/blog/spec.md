# blog Specification

## Purpose
Define el blog técnico: cómo se listan los posts, cómo se lee uno, y qué garantías de legibilidad y navegación ofrece un artículo largo con código y elementos interactivos.
## Requirements
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

### Requirement: Animación conceptual paso a paso
Un post DEBE poder embeber una animación que explique un concepto como una secuencia de pasos, y el lector DEBE poder recorrerla a su ritmo en ambos sentidos. En todo momento la animación DEBE mostrar en qué paso está y un texto que explique qué significa lo que ocurre en ese paso.

#### Scenario: Avanzar por los pasos
- **WHEN** el lector avanza al siguiente paso
- **THEN** el diagrama transiciona al estado de ese paso, el texto que lo acompaña se sustituye por el suyo y el indicador de posición refleja el paso nuevo

#### Scenario: Retroceder deja el diagrama consistente
- **WHEN** el lector retrocede a un paso anterior, tras haber recorrido la animación entera
- **THEN** el diagrama muestra exactamente el mismo estado que la primera vez que pasó por ese paso, sin restos acumulados de pasos posteriores

#### Scenario: Reproducción completa
- **WHEN** el lector pide reproducir la animación
- **THEN** esta recorre todos los pasos desde el primero y termina en el último, con el indicador y el texto acompañando al paso en curso

#### Scenario: Volver al inicio
- **WHEN** el lector reinicia la animación
- **THEN** el diagrama, el indicador y el texto vuelven al estado del primer paso

#### Scenario: Navegación durante la reproducción
- **WHEN** el lector navega a otro paso mientras la reproducción está en curso
- **THEN** la reproducción cede el control y la animación queda en el paso pedido, sin quedar a medio camino entre dos estados

#### Scenario: Extremos de la secuencia
- **WHEN** el lector está en el primer o en el último paso
- **THEN** el control que llevaría fuera de la secuencia está deshabilitado en lugar de no hacer nada al activarse

### Requirement: Animación conceptual sin movimiento
Cuando el visitante ha expresado a nivel de sistema que prefiere movimiento reducido, la animación NO DEBE interpolar entre estados. Todo su contenido DEBE seguir siendo alcanzable: los mismos pasos, el mismo diagrama y los mismos textos.

#### Scenario: Preferencia de movimiento reducido
- **WHEN** el visitante tiene activada la preferencia de movimiento reducido y navega entre pasos
- **THEN** el diagrama salta directamente al estado del paso destino, sin transición, y el texto y el indicador se actualizan igual que sin la preferencia

#### Scenario: Reproducción con movimiento reducido
- **WHEN** el visitante tiene activada la preferencia de movimiento reducido
- **THEN** el control de reproducción continua está deshabilitado, porque su único propósito es el movimiento, y el resto de la navegación sigue disponible

### Requirement: Identificación de la animación embebida
Un post DEBE referirse a una animación por un identificador estable, y solo DEBEN poder embeberse animaciones declaradas explícitamente en el sitio. Un identificador no declarado DEBE detener la compilación.

#### Scenario: Identificador declarado
- **WHEN** un post referencia una animación cuyo identificador está declarado
- **THEN** la animación se renderiza en su posición dentro del artículo

#### Scenario: Identificador desconocido
- **WHEN** un post referencia un identificador de animación que no está declarado
- **THEN** la compilación falla nombrando el identificador y dónde declararlo, en lugar de publicar un post con un hueco

### Requirement: Coste de las animaciones acotado al post que las usa
El código de una animación y el del motor que la mueve NO DEBEN descargarse al abrir un post que no embebe ninguna animación.

#### Scenario: Post sin animaciones
- **WHEN** el visitante abre un post que no embebe ninguna animación
- **THEN** no se descarga el código de ninguna animación ni el de su motor

#### Scenario: Espacio reservado mientras carga
- **WHEN** el visitante abre un post con una animación y su código todavía no ha llegado
- **THEN** el artículo reserva el espacio que ocupará la animación y anuncia que está cargando, sin desplazar el texto que hay debajo cuando aparece

### Requirement: Lectura de la animación en cualquier pantalla
Una animación embebida DEBE ser legible y operable en el ancho de un teléfono, y su navegación DEBE ser accesible con teclado y con lector de pantalla.

#### Scenario: Ancho de teléfono
- **WHEN** el visitante lee un post con una animación en una pantalla estrecha
- **THEN** el texto del diagrama sigue siendo legible y los controles son cómodos de pulsar con el dedo

#### Scenario: Diagrama más ancho que la pantalla
- **WHEN** la pantalla es más estrecha que el ancho mínimo con el que el diagrama se lee
- **THEN** el diagrama deja de encogerse y se desplaza horizontalmente dentro de su propio contenedor, sin que la página desborde, y ese contenedor es alcanzable con teclado y anuncia que es desplazable

#### Scenario: Navegación con teclado
- **WHEN** el visitante recorre la página con el teclado
- **THEN** alcanza los controles de la animación, puede activarlos y cada uno se anuncia con un nombre que dice qué hace

#### Scenario: Cambio de paso anunciado
- **WHEN** el visitante usa un lector de pantalla y cambia de paso
- **THEN** el texto del paso nuevo se anuncia sin que tenga que ir a buscarlo, y el diagrama tiene una descripción textual de lo que representa

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

