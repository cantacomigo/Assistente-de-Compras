import { ItemCompra, ResultadoComparacao } from "@/types/list";

/**
 * Gera uma lista de compras escalada pelo número de pessoas.
 * @param numPessoas Número de pessoas na família.
 * @returns Lista de ItemCompra.
 */
export function gerarListaInicial(numPessoas: number): ItemCompra[] {
  // Retorna uma lista vazia, pois a geração sugerida foi removida.
  return [];
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