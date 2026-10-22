# Problem Brief: Passport LATAM

## Decisión del problema

### Problema elegido
La opacidad en la cadena de suministro de la moda latinoamericana y la imposibilidad de verificar de forma confiable la autenticidad, origen y sostenibilidad de las prendas (Propuesto por Odry Nataly Isaramá).

### Por qué elegimos este
Elegimos este problema porque ataca directamente la brecha de confianza generada por el greenwashing en la industria textil colombiana y latinoamericana. Alineado con los criterios de la Sesión 1, el problema requiere compartir un registro inalterable entre múltiples partes que no se conocen ni confían entre sí (productores, auditores, distribuidores y consumidores), eliminando intermediarios centralizados que concentran la información.

### Propuestas descartadas
- Placa y trazabilidad logística general de envíos (Propuesto por Odry Nataly Isaramá): Descartada por depender excesivamente de infraestructura física tradicional e intermediarios logísticos fuera del alcance del ecosistema de moda independiente.
- Gestión de inventarios centralizada para microempresas (Propuesto por Odry Nataly Isaramá): Descartada porque una base de datos tradicional resuelve el problema de inventario sin necesidad de inmutabilidad ni descentralización en blockchain.

### Cómo tomamos la decisión
Como trabajo individual liderado por Odry Nataly Isaramá, la decisión se tomó mediante el análisis comparativo del impacto social y la pertinencia técnica, seleccionando la trazabilidad de moda sostenible en Stellar/Soroban por ser el caso de uso con mayor propuesta de valor para los productores locales.

---

## Problem Brief

### Encabezado
**Passport LATAM** — Pasaportes digitales de producto para América Latina, verificados on-chain en Stellar para prevenir el greenwashing y certificar el origen real de la moda.

### Equipo y roles
- **Integrante:** Odry Nataly Isaramá (Usuario GitHub: `nalydap1606-droide`)
- **Rol:** Líder de Producto, Desarrolladora Blockchain / Frontend y Responsable de Entregas.
- **Canal de coordinación interna:** Repositorio de GitHub (`nalydap1606-droide/Pasaporte-Latam-`) y comunicación directa.

### Problema y evidencia
La industria de la moda es una de las cadenas de suministro más opacas y contaminantes del mundo. En Colombia y América Latina, diseñadores independientes, marcas emergentes y talleres artesanales producen prendas de alta calidad e identidad propia; sin embargo, enfrentan un fenómeno masivo de greenwashing, donde empresas comunican un compromiso ambiental que no cumplen o usan etiquetas engañosas sin pruebas verificables. 

Esta opacidad genera una grave crisis de desconfianza en el consumidor final y en los mercados internacionales. Evidencia observada en investigaciones académicas (como el estudio del Externado y la investigación en el Tecnológico de Antioquia) demuestra que la falta de transparencia impide a los productores cobrar un precio justo por sus materiales éticos (como algodón reciclado o certificaciones GOTS/Fair Trade) y causa escepticismo en los compradores, reduciendo las ventas de marcas genuinamente sostenibles por no tener un mecanismo de prueba inmutable.

### Usuario y actores
El problema afecta principalmente a dos actores centrales de la cadena de valor:
1. **Productores y Diseñadores Independientes:** Marcas emergentes en ciudades como Medellín, Bogotá o Lima que producen prendas sostenibles pero carecen de presupuesto para auditorías corporativas costosas o sistemas cerrados, perdiendo la prueba de origen en cuanto el producto sale del taller.
2. **Consumidores Conscientes y Compradores Mayoristas:** Clientes e importadores que exigen trazabilidad real y necesitan distinguir una marca transparente de una que realiza greenwashing.
3. **Otros actores:** Auditores de sostenibilidad y talleres artesanales que intervienen aportando insumos o certificaciones pero no tienen un canal unificado para registrar sus datos.

Actualmente, los productores intentan resolver esto mediante etiquetas impresas de papel, archivos PDF adjuntos o sellos en la prenda. Esto cuesta tiempo, dinero en impresión y carece de credibilidad, ya que cualquier papel o PDF se puede falsificar, editar o perder fácilmente.

### Flujo actual de valor
El flujo tradicional de comercialización y trazabilidad se desarrolla en la siguiente secuencia numerada:
1. **Origen e Insumos:** El taller de confección en Colombia adquiere hilos o telas (ejemplo: algodón reciclado o fibras orgánicas) y recibe certificados en papel del proveedor.
2. **Manufactura:** Se confecciona la prenda en el taller y se le cose una etiqueta de cartón o tela con la marca y la composición declarada.
3. **Venta Mayorista / Distribución:** El taller envía el lote de prendas a distribuidores o tiendas multimarca en otras ciudades o países, acompañando la carga con facturas y guías en PDF.
4. **Exhibición y Venta Retail:** La tienda exhibe la prenda en el mostrador promocionándola como "sostenible" o "ecológica".
5. **Consumo Final:** El cliente examina la etiqueta de papel en el probador, pero no tiene forma de auditar si la prenda realmente proviene del taller indicado ni si los materiales son 100% orgánicos, debiendo confiar ciegamente en el marketing de la marca.

### Fricciones identificadas
1. **Falsificación y manipulación de etiquetas (Ocurre en la etapa 2 y 4):** Causado por la vulnerabilidad de las etiquetas impresas y sellos de papel, afectando al consumidor final que paga por un producto engañoso.
2. **Desconexión en la cadena de custodia (Ocurre en la etapa 3):** Causado por la falta de un registro unificado entre el fabricante y el distribuidor mayorista, lo que encarece y demora las verificaciones de importación.
3. **Greenwashing y escepticismo del mercado (Ocurre en la etapa 5):** Causado por la ausencia de pruebas auditables e independientes, afectando al productor ético que no puede justificar su precio justo ni diferenciarse de competidores que usan lenguaje engañoso.

### Oportunidad e hipótesis
**Oportunidad priorizada:** Eliminar el greenwashing y la opacidad mediante la creación de una prueba de origen digital, pública e inalterable en el punto de contacto con el consumidor (etiqueta con código QR).

**Hipótesis:** Si implementamos pasaportes digitales de producto en la red Stellar/Soroban vinculados a códigos QR en cada prenda, los productores podrán certificar sus materiales y el consumidor final podrá verificar la historia completa del producto en tiempo real, lo que incrementará la confianza del comprador y permitirá a las marcas éticas certificar su autenticidad sin depender de intermediarios costosos.

### Criterio de pertinencia
Este caso de uso requiere estrictamente un registro distribuido (blockchain) y no una base de datos tradicional por tres razones fundamentales basadas en la Sesión 1:
1. **Múltiples partes que no confían entre sí:** El fabricante en Medellín, el distribuidor en Ciudad de México, el auditor de sostenibilidad y el consumidor final no comparten una relación de confianza previa ni acceso a un servidor privado común.
2. **Registro histórico inalterable:** Una base de datos centralizada (SQL) o un servidor web privado permite al dueño del sistema modificar los datos de los materiales retroactivamente. Con Stellar y Soroban, el hash SHA-256 de los metadatos de la prenda queda grabado para siempre, garantizando que nadie pueda alterar las declaraciones iniciales.
3. **Eliminación de intermediarios:** Permite la verificación pública directa sin depender de una plataforma corporativa cerrada ni pagar licencias empresariales inaccesibles para emprendedores latinoamericanos.

### Supuestos y riesgos
1. **Supuesto 1:** Los productores de moda estarán dispuestos a conectar su wallet de Stellar (ej. Freighter) e integrar el flujo de registro digital en sus lotes de producción.
2. **Supuesto 2:** Los consumidores finales utilizarán sus teléfonos móviles para escanear el código QR en la etiqueta física y revisar la historia del producto.
3. **Riesgo (Factor de invalidación):** Resistencia inicial a la adopción digital por parte de talleres artesanales tradicionales o que la información ingresada en el origen sea falsa (riesgo que se mitiga al integrar firmas de certificadores externos en versiones avanzadas).
