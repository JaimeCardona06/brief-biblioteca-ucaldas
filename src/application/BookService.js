class BookService {
  constructor({ bookRepo, copyRepo }) {
    this.bookRepo = bookRepo;
    this.copyRepo = copyRepo;
  }

  createBook(payload) {
    return this.bookRepo.create(payload);
  }

  getBook(id) {
    return this.bookRepo.findById(id);
  }

  list(query) {
    const { q, disponible, alta_demanda, page = 1, per_page = 20 } = query || {};
    let items = this.bookRepo.list();
    if (q) {
      const ql = q.toLowerCase();
      items = items.filter(b => (b.name || '').toLowerCase().includes(ql) || (b.author || '').toLowerCase().includes(ql));
    }
    if (alta_demanda !== undefined) {
      const flag = String(alta_demanda) === 'true';
      items = items.filter(b => !!b.alta_demanda === flag);
    }
    if (disponible !== undefined) {
      const flag = String(disponible) === 'true';
      items = items.filter(b => {
        const copies = this.copyRepo.findByBook(b.id);
        const has = copies.some(c => c.state === 'disponible');
        return flag ? has : true;
      });
    }
    const total = items.length;
    const p = Number(page) || 1;
    const pp = Number(per_page) || 20;
    const data = items.slice((p - 1) * pp, p * pp);
    return { data, meta: { total, page: p, per_page: pp } };
  }
}

module.exports = BookService;
