# Prompt 1: Generación Básica (V1)

**Fecha:** 2026-05-12
**Propósito:** Generar una versión inicial y básica de la API de biblioteca sin contexto específico, para evidenciar el resultado de un prompt artesanal.

## Prompt Utilizado
> "Crea un proyecto básico de API REST en Node.js con Express para gestionar el préstamo de libros de una biblioteca. Necesito poder registrar libros, estudiantes, hacer préstamos y devoluciones, y calcular multas si se atrasan. Hazlo funcional, rápido, guardando los datos en variables en memoria (sin base de datos). Escribe los archivos (index.js, package.json, etc.) directamente en la raíz de este directorio. No crees carpetas adicionales."

## Resultado Obtenido
La IA generó una estructura monolítica con todos los endpoints (libros, estudiantes, préstamos, devoluciones) acoplados en un solo archivo `index.js`. Utilizó persistencia en memoria simple con arrays y configuró un `package.json` básico. Aunque el código es funcional y cumple con la instrucción mínima, carece de arquitectura modular, validaciones profundas y no contempla las reglas de negocio reales (como límites por tipo de estudiante o políticas estrictas de renovación).

## Evaluación
El prompt fue vago y carecía de contexto. Como resultado, el código es genérico, poco escalable y no resuelve los problemas de negocio específicos de la Universidad de Caldas. Esto demuestra la necesidad de aplicar Context Engineering.
