++# Prompt #1 — Generación inicial (versión 1, mal prompt)
++
**Fecha y hora:** 2026-05-12 10:30

**Propósito en una línea:** Generar rápidamente un backend inicial para la biblioteca (promptv1 deliberadamente vago).

**Etapa del taller:** 2

**IA usada:** ChatGPT / Claude (ejemplo)

---

### Prompt enviado (literal)

```
Crea un backend para la biblioteca de la universidad en Node
```

---

### Resumen de la respuesta de la IA

En 3–5 líneas, qué hizo la IA (respuesta simulada y mediocre):

> La IA generó un proyecto Node.js + Express muy básico. Creó `app.js`, instaló `express`, y añadió rutas mínimas `/books` y `/loans` con controladores superficiales. Los modelos son esquemas JavaScript muy simples (objetos planos), la persistencia la dejó en arrays en memoria y no implementó reglas de negocio completas (renovaciones, multas, colas). Usó librerías de gestión de fechas (p.ej. moment) sin pedir permiso y nombró campos distintos a los de la plantilla (p.ej. `title` en lugar de `name`). La respuesta incluyó instrucciones vagas para ejecutar el servidor.

---

### Mi evaluación

**¿La respuesta cumplió con lo que pedí?**

- [ ] Completamente.
- [x] Parcialmente. Faltó: definición precisa de endpoints, reglas de negocio, validaciones, y coincidencia con la plantilla de especificación.
- [ ] No, se desvió. Hizo: [...]

**¿La acepté tal cual o la modifiqué?**

- [ ] Tal cual.
- [x] La modifiqué a mano. Cambios: alineé nombres de campos con la especificación, quité moment.js, añadí validaciones y completé RN1/RN3/RN7 manualmente.
- [ ] Le pedí corrección con un prompt nuevo (ver prompt #2).
- [ ] La rechacé completamente. Razón: [...]

**¿Qué aprendí de esta interacción?**

> Si el prompt es muy corto y vago, la IA toma decisiones por defecto que pueden romper la consistencia con la especificación. Hay que anclar los prompts a la especificación formal.

---

## Plantilla en blanco (copiar para cada prompt nuevo)

Usar esta estructura para cada prompt: fecha, propósito, IA usada, prompt literal, resumen de la respuesta, mi evaluación y aprendizaje.
