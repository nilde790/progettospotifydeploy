import { describe, it, expect, jest } from '@jest/globals';

type CreateSongDTO = {
  id: number;
  title: string;
};

// Simuliamo un repository (potrebbe rappresentare un servizio o metodo di Prisma)
const songRepository = {
  create: (createSongDTO: CreateSongDTO) => {
    // In un test reale, qui ci sarebbe la logica vera
    console.log('Original create method called', createSongDTO);
    return { ...createSongDTO };
  },
};

describe('spyOn Demo', () => {
  it('should spy on the existing object', () => {
    // Creiamo uno spy sul metodo "create"
    const spy = jest.spyOn(songRepository, 'create');

    // Chiamiamo il metodo
    const result = songRepository.create({ id: 1, title: 'Lover' });

    // Verifichiamo che sia stato chiamato correttamente
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({ id: 1, title: 'Lover' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 1, title: 'Lover' });

    // Ripristiniamo il comportamento originale (buona prassi)
    spy.mockRestore();
  });
});