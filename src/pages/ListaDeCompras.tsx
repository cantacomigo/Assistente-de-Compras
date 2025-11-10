import React, { useEffect, useState, useCallback, SetStateAction, Dispatch, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ItemCompra, ResultadoComparacao } from '@/types/list';
import ListaItemRow from '@/components/ListaItemRow';
import { Plus, Calculator, Save, Loader2, ArrowLeft, Tag } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { calcularComparacao } from '@/utils/list-generator';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ListaDeComprasProps {
    list: ItemCompra[];
    setList: Dispatch<SetStateAction<ItemCompra[]>>; 
    setComparisonResult: (result: ResultadoComparacao) => void;
    numPessoas: number; // Mantido para compatibilidade com o hook, mas não usado no título
}

const ListaDeCompras: React.FC<ListaDeComprasProps> = ({ list, setList, setComparisonResult, numPessoas }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Se a lista inicial vier da navegação (Tela Inicial), use-a.
    useEffect(() => {
        // Verifica se há um estado de navegação com initialList
        if (location.state && 'initialList' in location.state) {
            const initialList = location.state.initialList as ItemCompra[];
            // Só atualiza se a lista atual estiver vazia ou se a lista inicial for diferente
            if (list.length === 0 || initialList.length > 0) {
                setList(initialList);
            }
        }
    }, [location.state, setList]);

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
            categoria: "Outros", // Categoria padrão para novos itens
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

        const { error } = await supabase
            .from('shopping_lists')
            .insert({
                user_id: user.id,
                name: listName,
                num_pessoas: numPessoas,
                list_data: list,
            });

        setIsSaving(false);

        if (error) {
            console.error("Erro ao salvar lista:", error);
            showError("Erro ao salvar lista. Tente novamente.");
        } else {
            showSuccess(`Lista "${listName}" salva com sucesso!`);
        }
    };

    // Agrupa a lista por categoria
    const groupedList = useMemo(() => {
        const groups: Record<string, ItemCompra[]> = {};
        list.forEach(item => {
            const category = item.categoria || "Outros";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
        });
        return groups;
    }, [list]);

    const categories = Object.keys(groupedList).sort();

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
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {user ? 'Salvar Lista' : 'Login Necessário'}
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

                <div className="rounded-lg border shadow-md">
                    <Table className="min-w-full">
                        <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                            <TableRow>
                                <TableHead className="w-1/4 min-w-[150px]">Item</TableHead>
                                <TableHead className="w-[150px] min-w-[150px]">Categoria</TableHead>
                                <TableHead className="w-[150px] text-center">Qtd (Unidade)</TableHead>
                                <TableHead className="w-[100px] text-right text-blue-600">Preço Proença (R$)</TableHead>
                                <TableHead className="w-[100px] text-right text-blue-600">Preço Iquegami (R$)</TableHead>
                                <TableHead className="w-[100px] text-right text-blue-600">Preço Max (R$)</TableHead>
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