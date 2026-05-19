# Auditoría curls — ejecución de pruebas reglas de negocio

**Fecha:** 2026-05-19
**Propósito:** Ejecutar y auditar los bloques curl del archivo `pruebas-reglas-negocio.md` contra la API en `http://localhost:3001`

<system_directive>
INSTRUCCIÓN DE NIVEL 0:
1. PROHIBIDO MODIFICAR el archivo `/home/salazar/Documentos/pruebas-software/brief-biblioteca-ucaldas/02-tu-trabajo/plantilla-prompts.md` ni el archivo `/home/salazar/Documentos/pruebas-software/brief-biblioteca-ucaldas/02-tu-trabajo/pruebas-reglas-negocio.md`.
2. Crea el directorio `PROMPTS/` en la RAÍZ de este proyecto backend (si no existe).
3. Guarda una copia de este prompt en `PROMPTS/auditoria-curl-ejecucion.md` para trazabilidad.
4. Crea el archivo `AUDITORIA.md` en la RAÍZ del repositorio backend para volcar la tabla de resultados.
</system_directive>

<task>
Tu tarea es auditar exclusivamente los bloques `curl` del archivo `/home/salazar/Documentos/pruebas-software/brief-biblioteca-ucaldas/02-tu-trabajo/pruebas-reglas-negocio.md`.

1. **Ajuste de Ruta:** Sustituye toda referencia a `$BASE_CON_IA` por `http://localhost:3001`.
2. **Ejecución y Verificación:** Ejecuta paso a paso cada prueba desde la `1.1` hasta la `VAL-4`.
3. **Registro en Tabla:** Al finalizar todas las pruebas, genera un archivo `AUDITORIA.md` en la raíz del backend con la tabla completa.

TABLA A GENERAR EN AUDITORIA.md:
| Prueba | Regla | Esperado | Con IA — HTTP | Con IA — body util |
| :--- | :--- | :--- | :--- | :--- |
| RN1-B cuarto prestamo pregrado | RN1 | 409 | | |
| RN2-B sexto prestamo posgrado | RN2 | 409 | | |
| RN5-B ejemplar ya prestado | RN5 | 409 | | |
| RN6-A plazo libro normal | RN6 | fecha + 15 dias | | |
| RN6-B plazo alta demanda | RN6 | fecha + 3 dias | | |
| RN3 prestamo con vencido | RN3 | 409 | | |
| RN4-B prestamo con multa | RN4 | 409 | | |
| RN8 calculo de multa | RN8 | N x 2000 | | |
| VAL-1 body vacio | — | 400 | | |
| VAL-2 estudiante inexistente | — | 404 | | |
| VAL-3 ejemplar inexistente | — | 404 | | |
| VAL-4 tipo incorrecto | — | 400 | | |

*Nota para 'Con IA — body util': escribe 'Si' si la respuesta incluye un mensaje explicativo (legible), o 'No' si solo devuelve el código de estado sin explicación.*
</task>

<execution_protocol>
- Lee el archivo de origen mencionado para extraer solo los cURL.
- Ajusta las rutas dinámicamente a `http://localhost:3001`.
- No interrumpas el proceso; registra los errores (ej. 500) en la columna correspondiente si ocurren.
- Completa la auditoría completa antes de finalizar.
</execution_protocol>