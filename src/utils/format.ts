/**
 * Formata um número para a moeda brasileira (BRL).
 * @param value O valor numérico.
 * @returns String formatada como R$ X.XXX,XX
 */
export function formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}