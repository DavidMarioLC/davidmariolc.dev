# projects Specification

## Purpose
Define cómo se listan y se detallan los proyectos del portafolio, para que cada trabajo tenga una página propia enlazable que explique el problema, la solución y el stack empleado.
## Requirements
### Requirement: Índice de proyectos
El sitio DEBE ofrecer en `/{locale}/projects` un índice de todos los proyectos publicados en ese idioma, cada uno con imagen de vista previa, título, descripción breve y acceso a su detalle.

#### Scenario: Todos los proyectos listados
- **WHEN** el visitante abre el índice de proyectos
- **THEN** ve todos los proyectos publicados en ese idioma, incluidos los que no están destacados en el home

#### Scenario: Orden declarado
- **WHEN** los proyectos declaran un orden
- **THEN** el índice los presenta en ese orden de forma estable entre compilaciones

### Requirement: Detalle de proyecto
Cada proyecto DEBE tener una página propia en `/{locale}/projects/{slug}` que muestre su título, su descripción, sus imágenes, el stack de tecnologías empleado y el cuerpo largo escrito en el contenido.

#### Scenario: Contenido largo renderizado
- **WHEN** el visitante abre el detalle de un proyecto cuyo cuerpo tiene encabezados, listas, enlaces, código e imágenes
- **THEN** todos ellos se renderizan con la tipografía y el espaciado del sistema visual del sitio

#### Scenario: Stack mostrado con logotipos
- **WHEN** un proyecto declara las tecnologías que usa
- **THEN** el detalle las muestra con su logotipo y su nombre

#### Scenario: Proyecto inexistente
- **WHEN** el visitante abre un slug de proyecto que no existe en ese idioma
- **THEN** recibe una página 404 del sitio con estado 404

### Requirement: Enlaces externos del proyecto
Un proyecto DEBE poder declarar enlaces a su sitio en producción y a su repositorio, y el detalle DEBE mostrar únicamente los que estén declarados.

#### Scenario: Proyecto sin repositorio público
- **WHEN** un proyecto declara solo su enlace en producción
- **THEN** el detalle muestra ese enlace y no deja un botón de repositorio vacío o roto

### Requirement: Páginas de proyecto pre-renderizadas
Todas las páginas de proyecto DEBEN generarse en la compilación para los dos idiomas y servirse como contenido estático.

#### Scenario: Todas las rutas generadas
- **WHEN** se compila el sitio
- **THEN** existe una ruta generada por cada combinación de proyecto publicado e idioma

