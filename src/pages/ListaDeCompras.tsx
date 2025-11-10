import React, { useEffect, useState, useCallback, SetStateAction, Dispatch, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ItemCompra, ResultadoComparacao } from '@/types/list';
import ListaItemRow from '@/components/ListaItemRow';
import { Plus, Calculator, Save, Loader2, Tag, Edit } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { calcularComparacao } from '@/utils/list-generator';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ListaDeComprasProps {
    list: ItemCompra[];
    setList: Dispatch<SetStateAction<ItemCompra[]>>; 
    setComparisonResult: (result: ResultadoComparacao | null) => void;
    numPessoas: number;
    currentListId: string | null; // Novo
    setCurrentListId: (id: string | null) => void; // Novo
}

const ListaDeCompras: React.FC<ListaDeComprasProps> = ({ list, setList, setComparisonResult, numPessoas, currentListId, setCurrentListId }) => {
    const navigate = useNavigate();
    const { user } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Limpa o resultado da comparação ao entrar na página de edição da lista
    useEffect(() => {
        setComparisonResult(null);
    }, [setComparisonResult]);

    const updateItem = useCallback((index: number, field: keyof ItemCompra | 'nome' | 'quantidade' | 'unidade' | 'proenca' | 'iquegami' | 'max' | 'categoria', value: string | number | null) => {
        setList(prevList => {
            const newList = [...prevList];
            const item = newList[index];

            if (field === 'nome' || field === 'unidade' || field === 'categoria') {
                item[field as 'nome' | 'unidade' | 'categoria'] = value as string;
            } else if (field === 'quantidade') {
                item[field] = value as number;
            } else if (['proenca', 'iquegami', 'max'].includes(field as string)) {
                item.precos[field as 'proenca' | 'iquegami' | 'max'] = value as number | null;
            }
            return newList;
        });
    }, [setList]);

    const removeItem = useCallback((index: number) => {
        setList(prevList => prevList.filter((_, i) => i !== index));
    }, [setList]);

    const addItem = () => {
        const newItem: ItemCompra = {
            id: `item-${Date.now()}`,
            nome: "Novo Item",
            quantidade: 1,
            unidade: "un",
            precos: { proenca: null, iquegami: null, max: null },
            categoria: "Outros (Diversos e Especiais)", // Categoria padrão para novos itens
        };
        setList(prevList => [...prevList, newItem]);
    };

    const handleCalculate = () => {
        // 1. Validação
        const itensIncompletos = list.filter(item => 
            item.quantidade <= 0 || 
            item.nome.trim() === "" ||
            (item.precos.proenca === null && item.precos.iquegami === null && item.precos.max === null)
        );

        if (itensIncompletos.length > 0) {
            showError("Por favor, preencha o nome, quantidade e pelo menos um preço válido para todos os itens.");
            return;
        }

        // 2. Cálculo
        setIsLoading(true);
        
        // Simula um pequeno delay para mostrar o loading spinner
        setTimeout(() => {
            const result = calcularComparacao(list);
            setComparisonResult(result);
            setIsLoading(false);
            navigate('/comparacao');
        }, 500);
    };

    const handleSaveList = async () => {
        if (!user) {
            showError("Você precisa estar logado para salvar listas.");
            return;
        }
        
        if (list.length === 0) {
            showError("A lista está vazia. Adicione itens antes de salvar.");
            return;
        }

        setIsSaving(true);
        
        const listName = `Lista de ${new Date().toLocaleDateString('pt-BR')}`;
        
        let error;
        let successMessage;

        if (currentListId) {
            // UPDATE: Atualiza a lista existente
            const { error: updateError } = await supabase
                .from('shopping_lists')
                .update({
                    name: listName, // Mantém o nome padrão ou poderia permitir edição
                    num_pessoas: numPessoas,
                    list_data: list,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', currentListId);
            
            error = updateError;
            successMessage = `Lista atualizada com sucesso!`;

        } else {
            // INSERT: Salva uma nova lista
            const { data, error: insertError } = await supabase
                .from('shopping_lists')
                .insert({
                    user_id: user.id,
                    name: listName,
                    num_pessoas: numPessoas,
                    list_data: list,
                })
                .select('id')
                .single();
            
            error = insertError;
            successMessage = `Lista "${listName}" salva com sucesso!`;

            if (data) {
                // Define o ID da lista recém-criada como a lista atual
                setCurrentListId(data.id);
            }
        }

        setIsSaving(false);

        if (error) {
            console.error("Erro ao salvar/atualizar lista:", error);
            showError("Erro ao salvar/atualizar lista. Tente novamente.");
        } else {
            showSuccess(successMessage);
        }
    };

    // Agrupa a lista por categoria
    const groupedList = useMemo(() => {
        const groups: Record<string, ItemCompra[]> = {};
        list.forEach(item => {
            // Garante que o item tenha uma categoria válida, usando o padrão se necessário
            const category = item.categoria || "Outros (Diversos e Especiais)";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
        });
        return groups;
    }, [list]);

    const categories = Object.keys(groupedList).sort();
    
    const saveButtonText = currentListId ? 'Atualizar Lista' : 'Salvar Lista';
    const saveButtonIcon = currentListId ? Edit : Save;

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                Minha Lista de Compras
            </h2>
            <div className="space-y-6">
                <div className="flex flex-wrap gap-2 justify-between items-center">
                    <Button 
                        onClick={addItem} 
                        variant="outline" 
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-300"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Adicionar Item
                    </Button>
                    
                    <div className="flex gap-2">
                        <Button 
                            onClick={handleSaveList} 
                            variant="secondary"
                            disabled={isLoading || isSaving || !user}
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                React.createElement(saveButtonIcon, { className: "h-4 w-4 mr-2" })
                            )}
                            {user ? saveButtonText : 'Login Necessário'}
                        </Button>
                        <Button 
                            onClick={handleCalculate} 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isLoading || list.length === 0}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Calculator className="h-4 w-4 mr-2" />
                            )}
                            Calcular e Comparar
                        </Button>
                    </div>
                </div>

                {currentListId && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 p-2 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
                        Você está editando uma lista salva. Clique em "{saveButtonText}" para salvar as alterações.
                    </div>
                )}

                <div className="rounded-lg border shadow-md">
                    <Table className="min-w-full">
                        <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                            <TableRow>
                                <TableHead className="w-[25%] min-w-[120px]">Item</TableHead>
                                <TableHead className="w-[15%] min-w-[120px]">Categoria</TableHead>
                                <TableHead className="w-[15%] text-center min-w-[100px]">Qtd (Unidade)</TableHead>
                                <TableHead className="w-[15%] text-right text-blue-600">Proença (R$)</TableHead>
                                <TableHead className="w-[15%] text-right text-blue-600">Iquegami (R$)</TableHead>
                                <TableHead className="w-[15%] text-right text-blue-600">Max (R$)</TableHead>
                                <TableHead className="w-10 text-center">Remover</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                    
                    {list.length === 0 ? (
                        <TableCaption className="py-4">Sua lista está vazia. Clique em "Adicionar Item" para começar!</TableCaption>
                    ) : (
                        <Accordion type="multiple" className="w-full" defaultValue={categories}>
                            {categories.map((category) => (
                                <AccordionItem key={category} value={category} className="border-t">
                                    <AccordionTrigger className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-3 font-semibold text-lg">
                                        <Tag className="h-5 w-5 mr-2 text-gray-500" />
                                        {category} ({groupedList[category].length} itens)
                                    </AccordionTrigger>
                                    <AccordionContent className="p-0">
                                        <Table className="w-full">
                                            <TableBody>
                                                {groupedList[category].map((item) => {
                                                    // Encontra o índice original na lista não agrupada para garantir que o updateItem funcione
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
                                            </TableBody>
                                        </Table>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ListaDeCompras;