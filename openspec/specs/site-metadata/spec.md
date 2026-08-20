# site-metadata Specification

## Purpose
Define cómo el sitio se describe a sí mismo ante buscadores, redes sociales y lectores de feeds, para que cada página sea indexable, se comparta con una vista previa correcta y el blog pueda seguirse sin visitarlo.
## Requirements
### Requirement: Metadata por página
Cada página DEBE declarar su propio título y descripción en el idioma activo, derivados de su contenido, y una URL canónica absoluta.

#### Scenario: Título de un post
- **WHEN** un buscador o una pestaña del navegador leen un detalle de post
- **THEN** obtienen el título del post junto al nombre del sitio, no un título genérico compartido

#### Scenario: Canónica absoluta
- **WHEN** se inspecciona cualquier página
- **THEN** declara una URL canónica absoluta que apunta a su propia ruta con prefijo de idioma

### Requirement: Alternativas por idioma
Cada página DEBE declarar sus alternativas de idioma para que los buscadores relacionen las versiones en inglés y español, incluida la alternativa por defecto para la raíz.

#### Scenario: Post disponible en ambos idiomas
- **WHEN** un post existe en inglés y en español
- **THEN** cada versión declara a la otra como alternativa de idioma, y ambas se declaran a sí mismas

#### Scenario: Página sin traducción publicada
- **WHEN** una pieza solo está publicada en un idioma
- **THEN** no se declara una alternativa que apunte a una URL inexistente

### Requirement: Vistas previas al compartir
Cada página DEBE ofrecer una imagen y unos metadatos de vista previa para redes sociales, específicos de su contenido cuando lo tenga y genéricos del sitio en caso contrario.

#### Scenario: Compartir un post
- **WHEN** se comparte la URL de un post en una red social
- **THEN** la vista previa muestra el título del post, su descripción y una imagen asociada a ese post

#### Scenario: Compartir una página sin imagen propia
- **WHEN** se comparte una página que no declara imagen
- **THEN** la vista previa usa la imagen por defecto del sitio, nunca una vista previa vacía

### Requirement: Sitemap y robots
El sitio DEBE publicar un sitemap que incluya todas las páginas públicas publicadas en ambos idiomas, y un archivo de robots que permita la indexación y apunte al sitemap. El contenido en borrador NO DEBE aparecer en el sitemap.

#### Scenario: Sitemap completo
- **WHEN** se solicita el sitemap
- **THEN** incluye home, índices y detalles de proyectos, posts y secciones, para los dos idiomas, con su fecha de última modificación

#### Scenario: Borrador excluido
- **WHEN** existe contenido marcado como borrador
- **THEN** no aparece en el sitemap

### Requirement: Feed del blog
El sitio DEBE publicar un feed de sindicación del blog por idioma, con los posts publicados en ese idioma, y DEBE anunciarlo desde las páginas del blog.

#### Scenario: Feed por idioma
- **WHEN** un lector de feeds solicita el feed en español
- **THEN** recibe un feed válido con los posts publicados en español, cada uno con título, enlace absoluto, fecha y resumen

#### Scenario: Feed descubrible
- **WHEN** un lector de feeds inspecciona el índice del blog
- **THEN** encuentra anunciado el feed correspondiente a ese idioma

### Requirement: Datos estructurados del autor y de los artículos
El home DEBE describir al autor y cada detalle de post DEBE describirse como artículo mediante datos estructurados válidos.

#### Scenario: Datos estructurados válidos
- **WHEN** se valida el marcado estructurado de un detalle de post
- **THEN** se reconoce como artículo con su titular, fecha de publicación y autor, sin errores de validación

