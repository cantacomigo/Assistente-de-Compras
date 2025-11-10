import React from 'react';
import { ItemCompra } from '@/types/list';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListaItemRowProps {
    item: ItemCompra;
    index: number;
    updateItem: (index: number, field: keyof ItemCompra | 'nome' | 'quantidade' | 'unidade' | 'proenca' | 'iquegami' | 'max', value: string | number) => void;
    removeItem: (index: number) => void;
}

const ListaItemRow: React.FC<ListaItemRowProps> = ({ item, index, updateItem, removeItem }) => {
    
    const handlePriceChange = (supermercado: 'proenca' | 'iquegami' | 'max', value: string) => {
        // Substitui vírgula por ponto para parsing e garante que é um número
        const numericValue = parseFloat(value.replace(',', '.') || '0');
        updateItem(index, supermercado, isNaN(numericValue) ? null : numericValue);
    };

    const formatPrice = (price: number | null): string => {
        if (price === null || isNaN(price)) return '';
        // Formata para PT-BR com vírgula
        return price.toFixed(2).replace('.', ',');
    };

    const isPriceValid = (price: number | null) => price !== null && price >= 0;

    return (
        <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {/* Item (Texto Editável) */}
            <td className="p-2">
                <Input
                    value={item.nome}
                    onChange={(e) => updateItem(index, 'nome', e.target.value)}
                    className="w-full h-8 p-1 border-none focus-visible:ring-1"
                />
            </td>
            
            {/* Quantidade e Unidade (Número Editável) */}
            <td className="p-2 w-[150px]">
                <div className="flex items-center space-x-1">
                    <Input
                        type="number"
                        min={0.01}
                        step={0.01}
                        value={item.quantidade}
                        onChange={(e) => updateItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                        className="w-1/2 h-8 p-1 text-right border-none focus-visible:ring-1"
                    />
                    <Input
                        value={item.unidade}
                        onChange={(e) => updateItem(index, 'unidade', e.target.value)}
                        className="w-1/2 h-8 p-1 border-none focus-visible:ring-1 text-xs"
                    />
                </div>
            </td>

            {/* Preços (Inputs Decimais BRL) */}
            {['proenca', 'iquegami', 'max'].map((supermercado) => {
                const key = supermercado as 'proenca' | 'iquegami' | 'max';
                const price = item.precos[key];
                
                return (
                    <td key={key} className="p-2 w-[100px]">
                        <Input
                            placeholder="0,00"
                            value={formatPrice(price)}
                            onChange={(e) => handlePriceChange(key, e.target.value)}
                            className={cn(
                                "w-full h-8 p-1 text-right font-mono",
                                !isPriceValid(price) && price !== null && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                    </td>
                );
            })}

            {/* Ação (Remover) */}
            <td className="p-2 w-10 text-center">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </td>
        </tr>
    );
};

export default ListaItemRow;