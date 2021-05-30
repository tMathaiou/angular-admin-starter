const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key): any {
      return store[key];
    },
    setItem(key, value): void {
      store[key] = value.toString();
    },
    clear(): void {
      store = {};
    },
    removeItem(key): void {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
