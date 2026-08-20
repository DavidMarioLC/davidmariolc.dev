## ADDED Requirements

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
