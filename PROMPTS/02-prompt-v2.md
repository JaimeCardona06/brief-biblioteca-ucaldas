# Prompt 2: Context Engineering y Arquitectura Limpia (V2)

**Fecha:** 2026-05-12
**Propósito:** Demostrar la aplicación de Ingeniería de Contexto proporcionando especificaciones detalladas, reglas de negocio y restricciones arquitectónicas para generar código escalable.

## Prompt Utilizado
> Estoy posicionado en la rama `FIAT-proyecto-v2`. Vamos a ejecutar la fase final de generación de código aplicando Ingeniería de Contexto y estándares de Senior.

**Tu Rol:** Actúa como un Arquitecto de Software y Desarrollador Backend Senior experto en Node.js y Clean Architecture.

**Contexto Principal:**
Debes leer y seguir ESTRICTAMENTE todas las definiciones del archivo: 
`02-tu-trabajo/plantilla-especificacion.md`

**Instrucciones de Arquitectura y Diseño:**
1. **Arquitectura Hexagonal:** Separa el código en capas claras:
   - `src/domain`: Entidades y lógica pura.
   - `src/application`: Casos de uso y servicios que orquestan las 8 Reglas de Negocio (RN1 a RN8).
   - `src/infrastructure`: Adaptadores de entrada (Express routes/controllers) y adaptadores de salida (Repositories con persistencia en memoria).
2. **Principios:** Aplica SOLID para el desacoplamiento y KISS para mantener la implementación limpia y legible.
3. **Inyección de Dependencias:** Los servicios deben recibir sus repositorios a través del constructor o parámetros.
4. **Manejo de Errores:** Implementa un middleware global en la capa de infraestructura para capturar errores y retornar los códigos HTTP definidos en la especificación (400, 404, 409, 500).

**Entregables:**
- Genera todos los archivos de la API (package.json, estructura de carpetas `src/`, etc.) directamente en la raíz de esta rama. 
- Implementa los 12 endpoints detallados en la tabla de la especificación.
- Asegúrate de que las RN (límites de libros, multas, bloqueos, renovaciones) estén programadas en la capa de aplicación.

## Resultado Obtenido
La IA generó una estructura de proyecto robusta y modular utilizando Arquitectura Hexagonal. El código se dividió en las capas de `domain`, `application` e `infrastructure`. Los servicios en la capa de aplicación (`LoanService`, etc.) implementaron con éxito las reglas de negocio (RN1 a RN8) dictadas en la especificación, como el límite de préstamos, cálculo de multas y restricciones de renovación. La persistencia se manejó a través de repositorios en memoria inyectados.

## Evaluación y Contraste
El contraste con la V1 es evidente. Gracias al archivo de especificaciones (Context Engineering), la IA pasó de generar un código acoplado (monolito de un solo archivo) a entregar un sistema mantenible y testeable que cumple con las reglas del negocio de la biblioteca de la universidad y los estándares técnicos de ingeniería.
