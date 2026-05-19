## ADDED Requirements

### Requirement: IDs como strings en entidades de dominio
Los constructores de todas las entidades de dominio (Book, Copy, Loan, Student, Fine, Solicitud) DEBEN aceptar y almacenar IDs como strings, no como números. El casteo `Number(id)` DEBE eliminarse.

#### Scenario: Book acepta id string
- **WHEN** se crea un Book con `{ id: "LIB-001" }`
- **THEN** `book.id` DEBE ser el string `"LIB-001"`, no `NaN`

#### Scenario: Student acepta id string
- **WHEN** se crea un Student con `{ id: "EST-PRE-01" }`
- **THEN** `student.id` DEBE ser el string `"EST-PRE-01"`

#### Scenario: Copy acepta id string
- **WHEN** se crea un Copy con `{ id: "EJ-001-01" }`
- **THEN** `copy.id` DEBE ser el string `"EJ-001-01"` y `copy.book_id` DEBE ser el string recibido

#### Scenario: Loan acepta student_id y copy_id como strings
- **WHEN** se crea un Loan con `{ student_id: "EST-PRE-01", copy_id: "EJ-001-01" }`
- **THEN** `loan.student_id` DEBE ser `"EST-PRE-01"` y `loan.copy_id` DEBE ser `"EJ-001-01"`

### Requirement: IDs como strings en repositorios
Los métodos de búsqueda en repositorios (`findById`, `findByStudent`, `findByBook`) DEBEN comparar IDs como strings, sin convertir a número.

#### Scenario: findById en BookRepository
- **WHEN** se consulta `bookRepo.findById("LIB-001")`
- **THEN** DEBE retornar el libro con id `"LIB-001"`, no `null` por comparación numérica

#### Scenario: findByStudent en LoanRepository
- **WHEN** se consulta `loanRepo.findByStudent("EST-PRE-01")`
- **THEN** DEBE retornar todos los préstamos con `student_id === "EST-PRE-01"`

### Requirement: Compatibilidad con API existente
Los endpoints de la API DEBEN aceptar IDs como strings y retornarlos como strings en las respuestas JSON.

#### Scenario: POST /prestamos acepta IDs string
- **WHEN** se envía `POST /prestamos` con `{ "student_id": "EST-PRE-01", "copy_id": "EJ-001-01" }`
- **THEN** la respuesta DEBE ser `201` con el préstamo creado, incluyendo `student_id: "EST-PRE-01"`
