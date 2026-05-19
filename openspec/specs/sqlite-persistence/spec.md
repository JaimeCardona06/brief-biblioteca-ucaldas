## ADDED Requirements

### Requirement: Datos persistentes en SQLite
El sistema SHALL almacenar todos los datos en una base de datos SQLite en lugar de en memoria. Los datos DEBEN sobrevivir a reinicios del servidor.

#### Scenario: Datos persisten después de reinicio
- **WHEN** se crea un libro, un estudiante y un préstamo
- **THEN** al reiniciar el servidor y consultar los mismos endpoints, los datos DEBEN estar disponibles

#### Scenario: Esquema se crea automáticamente
- **WHEN** se inicia la aplicación por primera vez
- **THEN** el archivo `data/biblioteca.db` DEBE crearse con todas las tablas necesarias

### Requirement: Tablas SQLite
El sistema DEBE tener las siguientes tablas con el esquema definido en design.md:

- `libros`: id (TEXT PK), codigo_inventario, titulo/nombre, autor, sala/ubicacion, alta_demanda (INTEGER), created_at
- `ejemplares`: id (TEXT PK), codigo, libro_id (TEXT FK), estado (TEXT), notas, reserved_until
- `estudiantes`: id (TEXT PK), codigo, nombre, programa_id, tipo (TEXT), multas_pendientes (REAL)
- `prestamos`: id (INTEGER PK AUTOINCREMENT), student_id (TEXT), copy_id (TEXT), fecha_prestamo (TEXT), fecha_devolucion_esperada (TEXT), fecha_devolucion_real (TEXT), estado (TEXT), renovaciones (INTEGER), original_plazo_days (INTEGER)
- `multas`: id (INTEGER PK AUTOINCREMENT), prestamo_id (INTEGER), student_id (TEXT), dias_atraso (INTEGER), monto (REAL), pagada (INTEGER), fecha_generada (TEXT)
- `solicitudes`: id (INTEGER PK AUTOINCREMENT), student_id (TEXT), book_id (TEXT), estado (TEXT), created_at (TEXT), satisfecha_at (TEXT)

#### Scenario: Tabla libros existe
- **WHEN** se inspecciona el esquema de la BD
- **THEN** la tabla `libros` DEBE existir con todas sus columnas

#### Scenario: Tabla prestamos existe
- **WHEN** se inspecciona el esquema de la BD
- **THEN** la tabla `prestamos` DEBE existir con todas sus columnas

### Requirement: Inyección de dependencias
Los repositorios SQLite DEBEN recibir la instancia de la base de datos a través del constructor (inyección de dependencias), igual que los repositorios en memoria actuales.

#### Scenario: Repositorio recibe dependencia
- **WHEN** se instancia un repositorio
- **THEN** el constructor DEBE aceptar un objeto con la propiedad `db`
