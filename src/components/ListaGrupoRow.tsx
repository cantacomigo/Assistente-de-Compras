import React from 'react';
import { ItemCompra } from '@/types/list';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TableRow } from '@/components/ui/table';
import { Tag } from 'lucide-react';
import ListaItemRow from './ListaItemRow';

interface ListaGrupoRowProps {
    category: string;
    items: ItemCompra[];
    updateItem: (index: number, field: any, value: any) => void;
    removeItem: (index: number) => void;
    list: ItemCompra[]; // Lista completa para encontrar o índice original
}

const ListaGrupoRow: React.FC<ListaGrupoRowProps> = ({ category, items, updateItem, removeItem, list }) => {
    // O AccordionItem precisa ser o elemento raiz para funcionar corretamente.
    // No entanto, ele precisa ser renderizado dentro de um <tr> para ser válido no TableBody.
    // Vamos usar uma única linha (<tr>) que contém o AccordionItem dentro de uma célula (<td>)
    // que abrange todas as colunas.

    return (
        <TableRow className="border-b-0 hover:bg-transparent">
            <td colSpan={7} className="p-0">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={category} className="border-b-0">
                        {/* O Trigger é o cabeçalho do grupo */}
                        <AccordionTrigger className="w-full px-4 py-3 font-semibold text-lg text-left hover:no-underline bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b">
                            <div className="flex items-center">
                                <Tag className="h-5 w-5 mr-2 text-gray-500" />
                                {category} ({items.length} itens)
                            </div>
                        </AccordionTrigger>
                        
                        {/* O Conteúdo do Accordion conterá as linhas de item */}
                        <AccordionContent className="p-0">
                            {/* Renderiza as linhas de item diretamente */}
                            {items.map((item) => {
                                const originalIndex = list.findIndex(i => i.id === item.id);
                                return (
                                    <ListaItemRow 
                                        key={item.id} 
                                        item={item} 
                                        index={originalIndex} 
                                        updateItem={updateItem} 
                                        removeItem={removeItem} 
                                    />
                                );
                            })}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </td>
        </TableRow>
    );
};

export default ListaGrupoRow;