import { useState, useEffect } from 'react';

/**
 * Hook que retorna um valor após um atraso especificado (debounce).
 * Útil para evitar que funções caras sejam chamadas em excesso (ex: autosave).
 * 
 * @param value O valor a ser 'debouced'.
 * @param delay O atraso em milissegundos.
 * @returns O valor debounced.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor debounced
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar ou se o componente for desmontado
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}