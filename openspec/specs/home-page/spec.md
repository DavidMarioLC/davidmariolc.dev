# home-page Specification

## Purpose
Define qué muestra la portada del sitio y en qué orden, para que un visitante entienda en una sola pantalla quién es el autor, qué ha construido y qué escribe, y pueda profundizar en cualquiera de esas ramas.
## Requirements
### Requirement: Estructura del home
El home DEBE presentar, en este orden: cabecera de identidad, introducción, Projects, Posts, Achievements, Community. Cada sección con listado DEBE ofrecer un acceso a su índice completo.

#### Scenario: Orden y presencia de secciones
- **WHEN** un visitante abre `/en` o `/es`
- **THEN** ve las seis secciones en el orden declarado, cada una con su título

#### Scenario: Acceso al índice completo
- **WHEN** el visitante activa "View all" en Projects, Posts o Community
- **THEN** llega al índice de esa sección en el idioma activo

### Requirement: Cabecera de identidad
El home DEBE mostrar el avatar del autor, su nombre y su país, tomados del perfil del autor para el idioma activo.

#### Scenario: Avatar con alternativa textual
- **WHEN** un lector de pantalla llega a la cabecera
- **THEN** el avatar expone una alternativa textual significativa o se marca como decorativo si el nombre ya está en texto

### Requirement: Introducción con referencias enriquecidas
La introducción DEBE renderizarse a partir del perfil del autor y DEBE soportar, dentro del texto corrido, referencias a organizaciones y tecnologías que se muestran como enlace o mención acompañada de su logotipo, además de un remate resaltado con el color de acento.

#### Scenario: Referencia con logotipo y enlace
- **WHEN** la introducción declara una referencia a una organización con enlace
- **THEN** se muestra su logotipo junto al nombre, dentro del flujo del párrafo, y el conjunto es un único destino navegable

#### Scenario: Referencia sin enlace
- **WHEN** la introducción declara una tecnología sin enlace
- **THEN** se muestra su logotipo y su nombre como texto, sin comportarse como enlace

#### Scenario: Los logotipos no rompen la línea base
- **WHEN** la introducción se ve en cualquier tamaño de pantalla
- **THEN** los logotipos se alinean con el texto de su línea y el párrafo mantiene su interlineado

### Requirement: Proyectos destacados en el home
El home DEBE mostrar como máximo tres proyectos destacados, seleccionados por una marca explícita en el contenido y con un orden declarado, cada uno con imagen de vista previa, título, descripción breve y acceso a su detalle.

#### Scenario: Selección explícita
- **WHEN** existen más de tres proyectos publicados
- **THEN** el home muestra únicamente los marcados como destacados, en su orden declarado, hasta un máximo de tres

#### Scenario: Sin proyectos destacados
- **WHEN** ningún proyecto está marcado como destacado
- **THEN** el home muestra los tres proyectos publicados más recientes en lugar de una sección vacía

### Requirement: Estados vacíos
Cuando una sección del home no tiene contenido publicado en el idioma activo, DEBE mostrar un estado vacío explícito en lugar de desaparecer o mostrar un hueco.

#### Scenario: Blog sin posts
- **WHEN** no hay ningún post publicado en el idioma activo
- **THEN** la sección Posts muestra un estado vacío traducido que anuncia que hay posts en camino

#### Scenario: La sección reaparece al publicar
- **WHEN** se publica el primer post en ese idioma
- **THEN** la sección Posts muestra los posts más recientes en lugar del estado vacío, sin cambios de código

### Requirement: Logros en el home
El home DEBE listar los logros publicados mostrando su logotipo, nombre, tipo de participación y año, y cada logro con enlace DEBE ser navegable hacia su referencia externa.

#### Scenario: Logro con referencia externa
- **WHEN** un logro declara una URL
- **THEN** su fila es un destino navegable señalado como externo

#### Scenario: Orden cronológico
- **WHEN** hay varios logros publicados
- **THEN** se listan del más reciente al más antiguo

### Requirement: Comunidad en el home
La sección Community DEBE mostrar un texto descriptivo y una galería de imágenes numeradas, cada una con su título y fecha.

#### Scenario: Galería numerada
- **WHEN** la sección muestra varias imágenes
- **THEN** cada una lleva un índice visible correlativo, su título y su fecha formateada según el idioma activo

#### Scenario: Galería en pantalla estrecha
- **WHEN** la galería se ve en un móvil
- **THEN** las imágenes siguen siendo legibles y recorribles sin desbordar horizontalmente la página

