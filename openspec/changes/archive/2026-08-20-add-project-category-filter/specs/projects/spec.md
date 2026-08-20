## ADDED Requirements

### Requirement: Listado de proyectos por categoría
El sitio DEBE ofrecer en `/{locale}/projects/categories/{category}` un listado de los proyectos publicados de esa categoría en ese idioma, presentados igual que en el índice de proyectos.

#### Scenario: Categoría con proyectos
- **WHEN** el visitante abre la página de una categoría que tiene proyectos publicados en ese idioma
- **THEN** ve todos esos proyectos y ninguno de otra categoría

#### Scenario: Vuelta al índice
- **WHEN** el visitante está en la página de una categoría
- **THEN** dispone de un enlace de vuelta al índice completo de proyectos

#### Scenario: Categoría sin proyectos
- **WHEN** el visitante abre una categoría del esquema que no tiene ningún proyecto publicado en ese idioma
- **THEN** recibe una página 404 del sitio con estado 404, en lugar de un listado vacío

#### Scenario: Categoría inexistente
- **WHEN** el visitante abre una categoría que no existe en el esquema de contenido
- **THEN** recibe una página 404 del sitio con estado 404

### Requirement: Navegación por categoría desde el índice
El índice de proyectos DEBE ofrecer acceso a cada categoría que tenga al menos un proyecto publicado en ese idioma, y NO DEBE ofrecer categorías vacías.

#### Scenario: Solo categorías con proyectos
- **WHEN** el visitante abre el índice de proyectos y solo hay proyectos de dos categorías
- **THEN** solo esas dos categorías aparecen como destino de navegación

#### Scenario: Sin proyectos publicados
- **WHEN** no hay ningún proyecto publicado en ese idioma
- **THEN** el índice no muestra navegación por categoría

### Requirement: Categoría enlazada desde el proyecto
Allí donde se muestra la categoría de un proyecto, esta DEBE enlazar a su listado de categoría en el idioma actual.

#### Scenario: Categoría enlazada en el detalle
- **WHEN** el visitante abre el detalle de un proyecto
- **THEN** la categoría mostrada lleva al listado de esa categoría

#### Scenario: Idioma conservado
- **WHEN** el visitante navega a una categoría desde una página en un idioma
- **THEN** llega al listado de esa categoría en ese mismo idioma

### Requirement: Páginas de categoría pre-renderizadas e indexables
Las páginas de categoría DEBEN generarse en la compilación para cada combinación de categoría con proyectos e idioma, servirse como contenido estático y aparecer en el sitemap.

#### Scenario: Rutas generadas
- **WHEN** se compila el sitio
- **THEN** existe una ruta generada por cada categoría que tiene al menos un proyecto publicado, en cada idioma donde los tiene

#### Scenario: Categoría en el sitemap
- **WHEN** se solicita el sitemap
- **THEN** incluye las páginas de categoría generadas, y ninguna categoría sin proyectos publicados

#### Scenario: Borrador excluido
- **WHEN** la única razón por la que una categoría tendría página es un proyecto en borrador
- **THEN** esa categoría no genera ruta ni aparece en la navegación del índice ni en el sitemap
