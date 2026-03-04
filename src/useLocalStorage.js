import { useState, useEffect } from 'react';

// Hook personalizado para localStorage com fallback
export function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(valorInicial);
  const [carregado, setCarregado] = useState(false);

  // Carrega do localStorage ao montar
  useEffect(() => {
    try {
      // Teste se localStorage funciona
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');

      const itemSalvo = localStorage.getItem(chave);
      if (itemSalvo) {
        setValor(JSON.parse(itemSalvo));
      }
    } catch (erro) {
      console.warn('localStorage não disponível (modo privado ou desabilitado)', erro);
    }
    setCarregado(true);
  }, [chave]);

  // Salva no localStorage sempre que o valor muda
  useEffect(() => {
    if (carregado) {
      try {
        localStorage.setItem(chave, JSON.stringify(valor));
      } catch (erro) {
        console.warn('Erro ao salvar no localStorage', erro);
      }
    }
  }, [valor, chave, carregado]);

  return [valor, setValor];
}
