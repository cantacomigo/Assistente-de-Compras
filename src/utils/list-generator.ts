import { ItemCompra, ResultadoComparacao } from "@/types/list";

// Base de itens essenciais por pessoa/grupo
const ITENS_BASE = [
  // Mercearia Seca
  { nome: "Arroz", base: 1, unidade: "kg", porPessoa: true, categoria: "Mercearia Seca" },
  { nome: "Feijão", base: 1, unidade: "kg", porPessoa: true, categoria: "Mercearia Seca" },
  { nome: "Óleo de Cozinha", base: 1, unidade: "ml", divisor: 2, quantidadeBase: 900, categoria: "Mercearia Seca" }, // 900ml por 2 pessoas
  { nome: "Açúcar", base: 1, unidade: "kg", divisor: 4, categoria: "Mercearia Seca" }, // 1kg por 4 pessoas
  { nome: "Café", base: 1, unidade: "g", divisor: 4, quantidadeBase: 500, categoria: "Mercearia Seca" }, // 500g por 4 pessoas
  { nome: "Macarrão", base: 1, unidade: "pacote (500g)", porPessoa: true, categoria: "Mercearia Seca" },
  
  // Laticínios e Ovos
  { nome: "Leite", base: 1, unidade: "L", porPessoa: true, categoria: "Laticínios e Ovos" },
  { nome: "Ovos", base: 1, unidade: "dúzia", divisor: 4, categoria: "Laticínios e Ovos" }, // 1 dúzia por 4 pessoas
  
  // Carnes e Proteínas
  { nome: "Carne Moída", base: 0.5, unidade: "kg", porPessoa: true, categoria: "Carnes e Proteínas" }, // 500g por pessoa
  
  // Hortifrúti
  { nome: "Banana", base: 1, unidade: "kg", porPessoa: true, categoria: "Hortifrúti" },
  { nome: "Tomate", base: 1, unidade: "kg", divisor: 2, categoria: "Hortifrúti" }, // 1kg por 2 pessoas

  // Padaria
  { nome: "Pão de Forma", base: 1, unidade: "pacote", divisor: 2, categoria: "Padaria" }, // 1 pacote por 2 pessoas
];

/**
 * Gera uma lista de compras escalada pelo número de pessoas.
 * @param numPessoas Número de pessoas na família.
 * @returns Lista de ItemCompra.
 */
export function gerarListaInicial(numPessoas: number): ItemCompra[] {
  if (numPessoas < 1) numPessoas = 1;

  return ITENS_BASE.map((item, index) => {
    let quantidade: number;

    if (item.porPessoa) {
      // 1kg por pessoa
      quantidade = numPessoas * item.base;
    } else if (item.divisor) {
      // Arredonda para cima a quantidade de unidades necessárias
      const unidadesNecessarias = Math.ceil(numPessoas / item.divisor);
      quantidade = unidadesNecessarias * (item.quantidadeBase || item.base);
    } else {
        quantidade = item.base;
    }

    return {
      id: `item-${index}-${Date.now()}`,
      nome: item.nome,
      quantidade: parseFloat(quantidade.toFixed(2)), // Mantém 2 casas decimais para quantidades
      unidade: item.unidade,
      precos: {
        proenca: null,
        iquegami: null,
        max: null,
      },
      // Adiciona a categoria ao item
      categoria: item.categoria,
    };
  });
}

/**
 * Calcula os totais e a sugestão de comparação.
 */
export function calcularComparacao(lista: ItemCompra[]): ResultadoComparacao {
    let totalProenca = 0;
    let totalIquegami = 0;
    let totalMax = 0;

    lista.forEach(item => {
        const qtd = item.quantidade;
        
        if (item.precos.proenca !== null) {
            totalProenca += item.precos.proenca * qtd;
        }
        if (item.precos.iquegami !== null) {
            totalIquegami += item.precos.iquegami * qtd;
        }
        if (item.precos.max !== null) {
            totalMax += item.precos.max * qtd;
        }
    });

    const totais = [
        { supermercado: "Proença", total: totalProenca },
        { supermercado: "Iquegami", total: totalIquegami },
        { supermercado: "Max", total: totalMax },
    ].filter(t => t.total > 0); // Apenas supermercados com preços preenchidos

    if (totais.length === 0) {
        return {
            totalProenca: 0, totalIquegami: 0, totalMax: 0,
            melhorOpcao: { supermercado: "Nenhum", total: 0 },
            economiaMax: 0, economiaMedia: 0,
        };
    }

    const melhorOpcao = totais.reduce((min, current) => (current.total < min.total ? current : min), totais[0]);
    const piorOpcao = totais.reduce((max, current) => (current.total > max.total ? current : max), totais[0]);

    const somaTotais = totais.reduce((sum, t) => sum + t.total, 0);
    const mediaTotais = somaTotais / totais.length;

    const economiaMax = piorOpcao.total - melhorOpcao.total;
    const economiaMedia = mediaTotais - melhorOpcao.total;

    return {
        totalProenca: totalProenca,
        totalIquegami: totalIquegami,
        totalMax: totalMax,
        melhorOpcao: melhorOpcao,
        economiaMax: parseFloat(economiaMax.toFixed(2)),
        economiaMedia: parseFloat(economiaMedia.toFixed(2)),
    };
}