const readline = require("readline");
const { execSync } = require("child_process");
const SHELL = process.platform === "win32" ? "C:\\Program Files\\Git\\bin\\bash.exe" : "bash";

const BASE_URL = "http://localhost:3001";
const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODELO = "qwen2.5-coder:7b"; // cambia si usaste otro

const SYSTEM_PROMPT = `
Eres un asistente de QA especializado en probar una API REST de biblioteca universitaria.

BASE URL del servidor: ${BASE_URL}

REGLAS DE NEGOCIO QUE DEBES CONOCER:
RN1. Un estudiante de pregrado no puede tener más de 3 préstamos activos. Si lo intenta: 409 Conflict.
RN2. Un estudiante de posgrado no puede tener más de 5 préstamos activos. Si lo intenta: 409 Conflict.
RN3. Si un estudiante tiene un préstamo vencido sin devolver, no puede solicitar nuevos préstamos: 409 Conflict.
RN4. Si un estudiante tiene multas pendientes sin pagar, no puede solicitar préstamos: 409 Conflict.
RN5. Un ejemplar que ya está prestado no puede prestarse de nuevo hasta que sea devuelto: 409 Conflict.
RN6. El plazo de préstamo depende del tipo de libro: 15 días para libros normales, 3 días para libros de alta demanda.
RN7. La renovación de un préstamo se deniega si otro estudiante está esperando el mismo libro: 409 Conflict.
RN8. La multa por devolución tardía es de 2000 pesos por día de retraso por cada libro.
RN9. Al crear un préstamo, los campos student_id y copy_id son obligatorios. Si faltan: 400 Bad Request.
RN10. Al devolver un préstamo, el campo prestamo_id es obligatorio. Si falta: 400 Bad Request.
RN11. Al crear un libro, los campos codigo_inventario, name y author son obligatorios. Si faltan: 400 Bad Request.
RN12. Al crear un estudiante, los campos code, name y program_id son obligatorios. Si faltan: 400 Bad Request.
RN13. Al crear un ejemplar, los campos book_id y code son obligatorios. Si faltan: 400 Bad Request. Si el código de ejemplar ya existe: 409 Conflict.
RN14. Un préstamo solo se puede renovar si está activo y dentro de su plazo. Si el préstamo está vencido, se marca como vencido automáticamente y se rechaza la renovación: 409 Conflict. Además, solo se permite máximo 1 renovación por préstamo.
RN15. No se puede devolver un préstamo que no esté en estado activo: 409 Conflict.
RN16. Al devolver un préstamo, si hay solicitudes activas de otros estudiantes para ese libro, el ejemplar se reserva automáticamente por 48 horas para el siguiente en la lista.

ENDPOINTS Y FIELD NAMES EXACTOS (usar SIEMPRE los field names en inglés, sin traducir):

# Crear libro → POST /api/libros
# Body: {"codigo_inventario": "LIB-001", "name": "Titulo", "author": "Autor", "location": "Sala General", "alta_demanda": false}
# Response: 201 Created

# Ver catálogo → GET /api/libros?q=&alta_demanda=&disponible=&page=1&per_page=20
# Response: 200 OK

# Ver detalle de libro → GET /api/libros/LIB-001
# Response: 200 OK (incluye sus ejemplares)

# Crear ejemplar → POST /api/ejemplares
# Body: {"book_id": "LIB-001", "code": "EJ-001-01"}
# Response: 201 Created

# Ver ejemplar → GET /api/ejemplares/EJ-001-01
# Response: 200 OK

# Crear estudiante → POST /api/estudiantes
# Body: {"code": "EST-PRE-01", "name": "Nombre", "program_id": "Ingenieria", "tipo": "pregrado"}
# NOTA: tipo puede ser "pregrado" o "posgrado"
# Response: 201 Created

# Ver préstamos activos de un estudiante → GET /api/estudiantes/:id/prestamos
# Response: 200 OK

# Ver historial de un estudiante → GET /api/estudiantes/:id/historial
# Response: 200 OK

# Crear préstamo → POST /api/prestamos
# Body: {"student_id": "EST-PRE-01", "copy_id": "EJ-001-01"}
# NOTA: los field names son student_id y copy_id (NO usar "estudiante_id" ni "ejemplar_id")
# Response: 201 Created

# Renovar préstamo → POST /api/prestamos/:id/renovar
# Body: no requiere body, solo el ID en la URL
# Response: 200 OK

# Listar préstamos vencidos → GET /api/prestamos/vencidos
# Response: 200 OK

# Registrar devolución → POST /api/devoluciones
# Body: {"prestamo_id": 1}
# NOTA: es POST /api/devoluciones (NO es PUT ni /api/prestamos/:id/devolucion)
# Response: 200 OK (con datos del préstamo y multa si aplica)

# Crear solicitud de reserva → POST /api/solicitudes
# Body: {"student_id": "EST-PRE-01", "book_id": "LIB-001"}
# Response: 201 Created

# Ver solicitudes activas de un libro → GET /api/solicitudes/LIB-001
# Response: 200 OK

INSTRUCCIONES DE COMPORTAMIENTO:
- Cuando el usuario pida probar una regla, genera el comando curl exacto para hacerlo usando los field names en inglés de arriba.
- Primero genera los datos de prueba necesarios (crear estudiante, crear libro, etc.) con sus curls exactos.
- Explica brevemente qué debe pasar y por qué código HTTP esperas.
- Si el usuario te pregunta por un error, analiza el código HTTP y el body de la respuesta.
- Si el usuario te pide ejecutar el curl, responde con el comando y di "EJECUTAR:" antes del comando para que el sistema lo detecte.
- Sé conciso. No repitas información que el usuario ya sabe.
`.trim();

const historial = [{ role: "system", content: SYSTEM_PROMPT }];

async function preguntarAlModelo(mensajeUsuario) {
  historial.push({ role: "user", content: mensajeUsuario });

  const respuesta = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODELO,
      messages: historial,
      stream: false,
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`Ollama respondió ${respuesta.status}. ¿Está corriendo? Ejecuta: ollama serve`);
  }

  const datos = await respuesta.json();
  const contenido = datos.message.content;
  historial.push({ role: "assistant", content: contenido });
  return contenido;
}

function ejecutarCurl(respuestaModelo) {
  const lineas = respuestaModelo.split("\n");
  let enComando = false;
  let comando = "";

  for (const linea of lineas) {
    const l = linea.trim();

    if (l.startsWith("EJECUTAR:")) {
      enComando = true;
      comando = l.replace("EJECUTAR:", "").trim();
      continue;
    }

    if (enComando) {
      if (!l || l.startsWith("```") || l.startsWith("**")) {
        // ejecutar
        if (comando) {
          console.log(`\n[EJECUTANDO]: ${comando}\n`);
          try {
            const resultado = execSync(comando, { encoding: "utf-8", timeout: 10000, shell: SHELL });
            console.log("[RESULTADO]:\n" + resultado);
          } catch (err) {
            console.log("[RESULTADO]:\n" + (err.stdout || err.message));
          }
        }
        enComando = false;
        comando = "";
      } else {
        comando += l;
      }
    }
  }

  // Último comando si la respuesta no termina con ```
  if (enComando && comando) {
    console.log(`\n[EJECUTANDO]: ${comando}\n`);
    try {
      const resultado = execSync(comando, { encoding: "utf-8", timeout: 10000, shell: SHELL });
      console.log("[RESULTADO]:\n" + resultado);
    } catch (err) {
      console.log("[RESULTADO]:\n" + (err.stdout || err.message));
    }
  }
}

async function iniciar() {
  console.log("=== Chatbot de Pruebas — Biblioteca UCaldas ===");
  console.log(`Modelo: ${MODELO}`);
  console.log(`Servidor: ${BASE_URL}`);
  console.log('Escribe tu pregunta. Ejemplos:');
  console.log('  "prueba que un pregrado no pueda tener 4 préstamos"');
  console.log('  "ejecuta la prueba RN6 para el plazo de alta demanda"');
  console.log('  "crea datos de prueba para RN1"');
  console.log('Escribe "salir" para terminar.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const preguntar = () => {
    rl.question("Tú: ", async (entrada) => {
      if (entrada.toLowerCase() === "salir") {
        console.log("Hasta luego.");
        rl.close();
        return;
      }

      if (!entrada.trim()) {
        preguntar();
        return;
      }

      try {
        const respuesta = await preguntarAlModelo(entrada);
        console.log(`\nChatbot: ${respuesta}\n`);
        ejecutarCurl(respuesta);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }

      preguntar();
    });
  };

  preguntar();
}

iniciar();