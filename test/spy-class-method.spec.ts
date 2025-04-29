import { describe, it, expect, jest } from '@jest/globals';

type CreateArtistDTO = {
  name: string;
};

class ArtistRepository {
  save(createArtistDTO: CreateArtistDTO): CreateArtistDTO {
    // Logica reale, che nei test evitiamo
    console.log('Original save called');
    return createArtistDTO;
  }
}

describe('Spy on class method', () => {
    afterEach(() => {
        jest.resetAllMocks();
      });
  it('should spy on the class method', () => {
    const artist = new ArtistRepository();

    // Sostituiamo momentaneamente il metodo reale con una mock implementation
    const spy = jest
      .spyOn(artist, 'save')
      .mockImplementation((createArtistDTO) => createArtistDTO);

    // Chiamiamo il metodo spied
    const result = artist.save({ name: 'Martin Garrix' });

});

it('should not carry over mock data', () => {
  const artist = new ArtistRepository();
  const spy = jest.spyOn(artist, 'save');

  // Senza chiamare il metodo!
  expect(spy).not.toHaveBeenCalled(); // Funziona grazie a afterEach!
});
});