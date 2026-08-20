## Purpose

Define cómo el sitio expone sus dos idiomas (inglés y español) en las URLs, cómo elige el idioma de un visitante que llega sin especificarlo, y cómo se traduce el texto de interfaz que no vive en el contenido.

## ADDED Requirements

### Requirement: Prefijo de idioma en todas las URLs públicas
Toda ruta pública del sitio DEBE estar bajo un prefijo de idioma: `/en/...` o `/es/...`. No DEBE existir una versión sin prefijo de una página de contenido.

#### Scenario: Página con prefijo
- **WHEN** un visitante abre `/es/posts`
- **THEN** recibe el índice del blog en español con código de estado 200

#### Scenario: Prefijo desconocido
- **WHEN** un visitante abre una ruta con un prefijo que no es un idioma soportado
- **THEN** recibe una página 404, no una redirección silenciosa a otro idioma

### Requirement: Negociación de idioma en la raíz
Cuando un visitante solicita `/`, el sistema DEBE redirigirlo a la raíz del idioma que corresponda: la preferencia previamente elegida por el visitante si existe, en su defecto el idioma de las cabeceras del navegador si es uno de los soportados, y en último término el idioma por defecto.

#### Scenario: Navegador en español
- **WHEN** un visitante sin preferencia guardada abre `/` con `Accept-Language: es`
- **THEN** es redirigido a `/es`

#### Scenario: Navegador en un idioma no soportado
- **WHEN** un visitante sin preferencia guardada abre `/` con un `Accept-Language` que no incluye ni inglés ni español
- **THEN** es redirigido a la raíz del idioma por defecto

#### Scenario: Preferencia previa gana sobre el navegador
- **WHEN** un visitante que ya eligió un idioma con el switcher vuelve a abrir `/`
- **THEN** es redirigido al idioma que eligió, aunque su navegador indique otro

### Requirement: Switcher de idioma que preserva la ubicación
El sitio DEBE ofrecer en la navegación un control para cambiar de idioma que mantenga al visitante en la página equivalente, DEBE indicar cuál es el idioma activo, y DEBE recordar la elección para visitas posteriores.

#### Scenario: Cambio de idioma dentro de una página de contenido
- **WHEN** el visitante está en `/en/posts/mi-post` y pulsa `ES`
- **THEN** llega a la versión en español de ese mismo post, no al índice ni al home

#### Scenario: La página equivalente no existe
- **WHEN** el visitante cambia de idioma en una página cuya traducción no está publicada
- **THEN** llega a la página de listado correspondiente en el idioma elegido, informado de que esa pieza no está traducida

#### Scenario: Idioma activo señalado
- **WHEN** el visitante está en cualquier página en español
- **THEN** el control muestra `ES` como opción activa de forma perceptible visualmente y para lectores de pantalla

### Requirement: Texto de interfaz traducido
Todo texto de interfaz que no provenga del contenido (elementos de navegación, títulos de sección, etiquetas de botones, estados vacíos, textos de error y de accesibilidad) DEBE provenir de catálogos de mensajes por idioma. NO DEBE quedar texto visible codificado en un solo idioma dentro de los componentes.

#### Scenario: Catálogo incompleto
- **WHEN** un catálogo de idioma carece de una clave que el otro sí tiene
- **THEN** la verificación del proyecto lo reporta como error antes de desplegar

#### Scenario: Formato de fechas y números por idioma
- **WHEN** se muestra la fecha de un post o de una foto de comunidad
- **THEN** se formatea según las convenciones del idioma activo

### Requirement: Declaración de idioma en el documento
Cada página DEBE declarar su idioma en el elemento raíz del documento HTML.

#### Scenario: Atributo lang correcto
- **WHEN** se sirve cualquier página bajo `/es`
- **THEN** el elemento `html` declara el idioma español
