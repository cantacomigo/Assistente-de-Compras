export interface ItemCompra {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  precos: {
    proenca: number | null;
    iquegami: number | null;
    max: number | null;
  };
  categoria: string; // Novo campo
}

export interface ResultadoComparacao {
  totalProenca: number;
  totalIquegami: number;
  totalMax: number;
  melhorOpcao: {
    supermercado: string;
    total: number;
  };
  economiaMax: number;
  economiaMedia: number;
}