import LoanService from '../../src/application/LoanService';
import { Conflict } from '../../src/domain/errors';

describe('CrearPrestamo — RN1 límite de préstamos simultáneos', () => {
  const makeMockRepos = (overrides = {}) => {
    const student = { id: 1, code: 'POS001', name: 'Test Posgrado', tipo: 'posgrado', multas_pendientes: 0 };
    const copy = { id: 10, code: 'CP-010', book_id: 100, state: 'disponible', notas: null, reservedUntil: null };
    const book = { id: 100, codigo_inventario: 'B100', name: 'Test Book', author: 'Author', alta_demanda: false };

    return {
      studentRepo: {
        findById: jest.fn().mockReturnValue(student),
        ...overrides.studentRepo,
      },
      copyRepo: {
        findById: jest.fn().mockReturnValue(copy),
        ...overrides.copyRepo,
      },
      bookRepo: {
        findById: jest.fn().mockReturnValue(book),
        ...overrides.bookRepo,
      },
      loanRepo: {
        countActiveByStudent: jest.fn().mockReturnValue(0),
        findByStudent: jest.fn().mockReturnValue([]),
        create: jest.fn().mockImplementation((data) => ({ id: 99, ...data })),
        ...overrides.loanRepo,
      },
      fineRepo: {
        sumUnpaidByStudent: jest.fn().mockReturnValue(0),
        ...overrides.fineRepo,
      },
      solicitudRepo: {
        findActiveByBook: jest.fn().mockReturnValue([]),
        ...overrides.solicitudRepo,
      },
    };
  };

  it('RN1 — posgrado falla al intentar el sexto préstamo', async () => {
    const mocks = makeMockRepos({
      loanRepo: {
        countActiveByStudent: jest.fn().mockReturnValue(5),
        findByStudent: jest.fn().mockReturnValue([]),
        create: jest.fn(),
      },
    });

    const loanService = new LoanService(mocks);

    expect(() =>
      loanService.createLoan({ student_id: 1, copy_id: 10 })
    ).toThrow(Conflict);

    try {
      loanService.createLoan({ student_id: 1, copy_id: 10 });
    } catch (err) {
      expect(err).toBeInstanceOf(Conflict);
      expect(err.message).toBe('limite_prestamos_alcanzado');
      expect(err.status).toBe(409);
    }
  });

  it('RN1 — pregrado falla al intentar el cuarto préstamo', async () => {
    const student = { id: 2, code: 'PRE001', name: 'Test Pregrado', tipo: 'pregrado', multas_pendientes: 0 };
    const mocks = makeMockRepos({
      studentRepo: { findById: jest.fn().mockReturnValue(student) },
      loanRepo: {
        countActiveByStudent: jest.fn().mockReturnValue(3),
        findByStudent: jest.fn().mockReturnValue([]),
        create: jest.fn(),
      },
    });

    const loanService = new LoanService(mocks);

    try {
      loanService.createLoan({ student_id: 2, copy_id: 10 });
    } catch (err) {
      expect(err).toBeInstanceOf(Conflict);
      expect(err.message).toBe('limite_prestamos_alcanzado');
    }
  });
});
