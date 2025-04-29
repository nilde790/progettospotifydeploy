describe("Mock Function Examples", () => {
    it("should create a basic mock function", () => {
      const mockFn = jest.fn(); // 1 - Creazione di una funzione mock vuota
      
      mockFn.mockReturnValue(3); // 2 - Configuriamo la funzione mock per restituire 3
      
      console.log(mockFn()); // Viene chiamata la funzione mock
      
      expect(mockFn()).toBe(3); // 3 - Verifica che la funzione mock ritorni 3
      expect(mockFn.mock.calls.length).toBe(2); // 4 - Verifica che la funzione mock sia stata chiamata due volte
      expect(mockFn).toHaveBeenCalled(); // 5 - Verifica che la funzione mock sia stata chiamata
    });
  });