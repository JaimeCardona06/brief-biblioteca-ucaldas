++# Prompt #2 — Prompt Maestro (versión 2, estructurado)
++
**Fecha y hora:** 2026-05-12 10:45

**Propósito en una línea:** Solicitar a la IA generar un backend REST en Node.js (Express) que implemente exactamente la Especificación Formal del Sistema de Préstamo de Libros definida en `02-tu-trabajo/plantilla-especificacion.md`.

**Etapa del taller:** 2

**IA usada:** ChatGPT / Claude (ejemplo)

---

### Prompt enviado (literal)

```
Actúa como un ingeniero de software senior y genera únicamente el esqueleto de un backend REST en Node.js + Express que implemente estrictamente la Especificación Formal del Sistema de Préstamo de Libros. Usa la siguiente especificación como única fuente de verdad (respeta nombres de campos, tipos y reglas de negocio):

---
[INCLUYE AQUÍ EL CONTENIDO DE 02-tu-trabajo/plantilla-especificacion.md]
---

Requisitos expresos del output:
1) Crea únicamente los archivos de estructura (rutas, controladores, modelos en memoria y tests de ejemplo). NO generes código de producción, no instales dependencias adicionales sin mencionarlo.  
2) Para cada endpoint incluido en la especificación, genera la firma de la ruta, el body esperado (JSON schema breve) y un ejemplo de respuesta exitosa.  
3) Implementa pseudocódigo o comentarios muy claros en cada controlador que indiquen la regla de negocio exacta (RN1..RN8) y cómo se debe comprobar.  
4) Describe la estructura de datos en memoria (ejemplos de objetos).  
5) Lista los comandos necesarios para ejecutar tests (sin ejecutarlos).  
6) Recuerda que la persistencia es en memoria en esta versión.  

Entrega esperada (formato):
- Un índice de archivos que la IA generaría.
- Para cada endpoint: ruta, método, body schema, respuesta 200/201, códigos error y razones.
- Pseudocódigo o fragmentos comentados que muestren cómo aplicar RN1..RN8.
- Esquemas JSON para las entidades principales (Libro, Ejemplar, Estudiante, Prestamo, Multa, Solicitud).

Comienza tu respuesta indicando en una línea: "He leído y seguiré la especificación. Entregando artefactos en formato de diseño y pseudocódigo." Luego procede con el índice y el contenido.

No generes archivos reales ni ejecutes comandos en mi entorno; solo responde con el contenido estructurado que usaría un desarrollador para implementar la API.
```

---

### Resumen de la respuesta de la IA (simulado — excelente)

En 3–5 líneas, qué haría la IA con este prompt maestro:

> La IA confirma haber leído la especificación y entrega un índice detallado de archivos (rutas/, controllers/, models/, tests/). Para cada endpoint proporciona la firma de la ruta, el JSON Schema del body, ejemplos de respuesta, y pseudocódigo que implementa RN1..RN8 paso a paso. También incluye la estructura de datos en memoria (ejemplos de objetos), los comandos sugeridos para ejecutar tests y una lista de decisiones asumidas (si alguna). El resultado es utilizable como especificación de implementación por un desarrollador humano.

---

### Mi evaluación prevista

**¿La respuesta resolvería el objetivo?**

- [x] Completamente. El prompt está anclado a la especificación y obliga a la IA a devolver artefactos útiles sin ejecutar código.
- [ ] Parcialmente.
- [ ] No.

**¿Qué comprobaría primero?**

- Que los nombres de campos y rutas coincidan exactamente con `02-tu-trabajo/plantilla-especificacion.md`.
- Que RN1..RN8 estén presentes en forma de pseudocódigo y que las respuestas de error usen los códigos HTTP establecidos.
