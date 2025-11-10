import React, { useState, useEffect } from 'react';
import { ItemCompra } from '@/types/list';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/utils/categories';

interface ListaItemRowProps {
    item: ItemCompra;
    index: number;
    updateItem: (index: number, field: keyof ItemCompra | 'nome' | 'quantidade' | 'unidade' | 'proenca' | 'iquegami' | 'max' | 'categoria', value: string | number | null) => void;
    removeItem: (index: number) => void;
}

// Função auxiliar para formatar o preço para exibição (X,XX)
const formatPriceToBRL = (price: number | null): string => {
    if (price === null || isNaN(price)) return '';
    return price.toFixed(2).replace('.', ',');
};

// Função auxiliar para converter a entrada BRL para número
const parsePriceFromBRL = (value: string): number | null => {
    const cleanedValue = value.replace(',', '.').trim();
    if (cleanedValue === '') return null;

    const numericValue = parseFloat(cleanedValue);
    if (isNaN(numericValue) || numericValue < 0) return null;
    
    // Garante 2 casas decimais antes de salvar no estado global
    return parseFloat(numericValue.toFixed(2));
};

const ListaItemRow: React.FC<ListaItemRowProps> = ({ item, index, updateItem, removeItem }) => {
    
    // Estados locais para gerenciar a digitação dos preços
    const [proencaInput, setProencaInput] = useState(formatPriceToBRL(item.precos.proenca));
    const [iquegamiInput, setIquegamiInput] = useState(formatPriceToBRL(item.precos.iquegami));
    const [maxInput, setMaxInput] = useState(formatPriceToBRL(item.precos.max));

    // Sincroniza o estado local com o estado global (item.precos) quando o item muda
    useEffect(() => {
        setProencaInput(formatPriceToBRL(item.precos.proenca));
        setIquegamiInput(formatPriceToBRL(item.precos.iquegami));
        setMaxInput(formatPriceToBRL(item.precos.max));
    }, [item.precos.proenca, item.precos.iquegami, item.precos.max]);

    const handleBlur = (supermercado: 'proenca' | 'iquegami' | 'max', inputValue: string) => {
        const numericValue = parsePriceFromBRL(inputValue);
        
        // 1. Atualiza o estado global (list)
        updateItem(index, supermercado, numericValue);

        // 2. Re-formata o estado local para garantir que ele exiba X,XX
        if (numericValue !== null) {
            const formattedValue = formatPriceToBRL(numericValue);
            switch (supermercado) {
                case 'proenca':
                    setProencaInput(formattedValue);
                    break;
                case 'iquegami':
                    setIquegamiInput(formattedValue);
                    break;
                case 'max':
                    setMaxInput(formattedValue);
                    break;
            }
        } else {
             // Se o valor for null (vazio ou inválido), limpa o input local
             switch (supermercado) {
                case 'proenca':
                    setProencaInput('');
                    break;
                case 'iquegami':
                    setIquegamiInput('');
                    break;
                case 'max':
                    setMaxInput('');
                    break;
            }
        }
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
            
            {/* Categoria (Select) */}
            <td className="p-1 w-[15%]">
                <Select 
                    value={item.categoria} 
                    onValueChange={(value) => updateItem(index, 'categoria', value)}
                >
                    <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>

            {/* Quantidade e Unidade (Número Editável) */}
            <td className="p-1 w-[15%]">
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
            {[
                { key: 'proenca', inputState: proencaInput, setInputState: setProencaInput },
                { key: 'iquegami', inputState: iquegamiInput, setInputState: setIquegamiInput },
                { key: 'max', inputState: maxInput, setInputState: setMaxInput },
            ].map(({ key, inputState, setInputState }) => {
                const price = item.precos[key as 'proenca' | 'iquegami' | 'max'];
                
                return (
                    <td key={key} className="p-1 w-[15%]">
                        <Input
                            placeholder="0,00"
                            value={inputState}
                            onChange={(e) => setInputState(e.target.value)}
                            onBlur={() => handleBlur(key as 'proenca' | 'iquegami' | 'max', inputState)}
                            className={cn(
                                "w-full h-8 p-1 text-right font-mono text-sm",
                                !isPriceValid(price) && price !== null && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                    </td>
                );
            })}

            {/* Ação (Remover) */}
            <td className="p-1 w-10 text-center">
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