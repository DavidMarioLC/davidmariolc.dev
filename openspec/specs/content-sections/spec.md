# content-sections Specification

## Purpose
Define las secciones del sitio que son listados curados —Books, Setup, Community y Achievements— para que cada una tenga su propia página con la misma estructura y comportamiento predecible.
## Requirements
### Requirement: Página de libros
El sitio DEBE ofrecer en `/{locale}/books` una cabecera con el título de la página, un subtítulo y un párrafo de introducción, y a continuación los libros publicados agrupados en tres estados de lectura fijos y en este orden: en curso, ya leídos y pendientes. Cada libro DEBE representarse únicamente por su portada dentro de una card. El título y el autor NO DEBEN mostrarse como texto visible en la página: DEBEN alimentar la alternativa textual de la portada.

#### Scenario: Orden fijo de los grupos
- **WHEN** el visitante abre la página de libros con libros en los tres estados
- **THEN** ve los grupos en el orden en curso, ya leídos y pendientes, cada uno bajo su propio encabezado traducido

#### Scenario: Libro representado solo por su portada
- **WHEN** se muestra un libro en cualquiera de los grupos
- **THEN** se ve su portada dentro de una card, sin título ni autor como texto visible, y un lector de pantalla anuncia el título y el autor a través de la alternativa textual de la portada

#### Scenario: Estado de lectura sin libros
- **WHEN** ningún libro publicado en ese idioma está en uno de los tres estados
- **THEN** ese grupo no se muestra, en lugar de dejar un encabezado sin contenido

### Requirement: Página de setup
El sitio DEBE ofrecer en `/{locale}/setup` una cabecera con el título de la página y un subtítulo, y a continuación cuatro bloques con encabezado propio traducido: hardware, stack y herramientas, editor y terminal, y aplicaciones de uso diario.

#### Scenario: Bloques presentes y en orden
- **WHEN** el visitante abre la página de setup
- **THEN** ve los cuatro bloques en el orden declarado, cada uno bajo su encabezado

### Requirement: Bloque de hardware
El bloque de hardware DEBE presentar sus elementos como una rejilla de cards de dos columnas, cada card con una etiqueta y su valor en texto.

#### Scenario: Card de hardware
- **WHEN** el bloque de hardware muestra un elemento
- **THEN** se ve su etiqueta y su valor dentro de una card con borde

#### Scenario: Rejilla en pantalla estrecha
- **WHEN** la página se ve en un móvil
- **THEN** las cards se reordenan a una sola columna sin desbordar horizontalmente la página

### Requirement: Bloques de categorías con entradas
Los bloques de stack y herramientas, editor y terminal, y aplicaciones de uso diario DEBEN presentarse como filas separadas entre sí, con la etiqueta de la categoría a un lado y las entradas de esa categoría al otro. Cada entrada DEBE mostrar su logotipo de marca junto a su nombre cuando declare uno, y DEBE mostrarse solo como texto cuando no lo declare. Estas entradas NO DEBEN comportarse como enlaces.

#### Scenario: Entrada con logotipo
- **WHEN** una entrada declara un logotipo de marca
- **THEN** se muestra el logotipo junto al nombre de la entrada, dentro de la fila de su categoría

#### Scenario: Entrada sin logotipo
- **WHEN** una entrada no declara logotipo
- **THEN** se muestra únicamente su nombre como texto, sin hueco ni icono de sustitución

#### Scenario: Varias entradas en una categoría
- **WHEN** una categoría tiene varias entradas
- **THEN** se muestran todas en la misma fila, separadas de forma legible y sin desbordar horizontalmente la página

### Requirement: Comunidad enlazada a su propio sitio
La galería de comunidad del home DEBE enlazar al sitio de la comunidad, no a un índice dentro de este sitio. El destino DEBE venir del contenido y abrirse en una pestaña nueva, señalado como enlace externo.

#### Scenario: Enlace al sitio de la comunidad
- **WHEN** el perfil declara la URL de la comunidad
- **THEN** el enlace "ver todo" apunta a esa URL absoluta, se abre en pestaña nueva con `rel` seguro y muestra el indicador de enlace externo

#### Scenario: Perfil sin URL de comunidad
- **WHEN** el perfil no declara la URL
- **THEN** la sección se muestra sin enlace, en lugar de apuntar a una ruta inexistente

### Requirement: Logros listados en el home
La lista de logros DEBE mostrarse completa en el home, con logotipo, nombre, tipo de participación, año y referencia externa cuando exista. No DEBE existir una página de índice aparte mientras el home los muestre todos.

#### Scenario: Logro sin referencia
- **WHEN** un logro no declara URL
- **THEN** se muestra como fila informativa, sin comportarse como enlace

### Requirement: Comportamiento consistente entre secciones
Todas estas secciones DEBEN compartir el marco del sitio, mostrar un estado vacío traducido cuando no hay contenido publicado en ese idioma, y estar alcanzables desde la navegación global o desde el home.

#### Scenario: Sección sin contenido
- **WHEN** una de estas secciones no tiene contenido publicado en el idioma activo
- **THEN** muestra su título y un estado vacío traducido, en lugar de un 404 o una página en blanco

