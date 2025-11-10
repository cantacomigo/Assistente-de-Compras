import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ItemCompra, ResultadoComparacao } from '@/types/list';
import { calculateComparacao } from '@/utils/list-generator';
import ListaItemRow from '@/components/ListaItemRow';
import { Plus, Calculator, Save, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from '@/utils/toast';
import { calcularComparacao } from '@/utils/list-generator';

interface ListaDeComprasProps {
    list: ItemCompra[];
    setList: (list: ItemCompra[]) => void;
    setComparisonResult: (result: ResultadoComparacao) => void;
    numPessoas: number;
}

const ListaDeCompras: React.FC<ListaDeComprasProps> = ({ list, setList, setComparisonResult, numPessoas }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Se a lista inicial vier da navegação (Tela Inicial), use-a.
    useEffect(() => {
        if (location.state && location.state.initialList && list.length === 0) {
            setList(location.state.initialList);
        } else if (list.length === 0) {
            // Se a lista estiver vazia e não houver estado inicial, redireciona para o início
            navigate('/');
        }
    }, [location.state, list, setList, navigate]);

    const updateItem = useCallback((index: number, field: keyof ItemCompra | 'nome' | 'quantidade' | 'unidade' | 'proenca' | 'iquegami' | 'max', value: string | number | null) => {
        setList(prevList => {
            const newList = [...prevList];
            const item = newList[index];

            if (field === 'nome' || field === 'unidade') {
                item[field] = value as string;
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
            toast.showError("Por favor, preencha o nome, quantidade e pelo menos um preço válido para todos os itens.");
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

    const handleSaveList = () => {
        // Implementação futura: Salvar lista no Supabase ou Local Storage
        toast.showSuccess("Lista salva localmente! (Implementação de banco de dados em andamento)");
    };

    if (list.length === 0 && !location.state?.initialList) {
        return (
            <Layout title="Lista de Compras">
                <div className="text-center p-10">
                    <p className="text-lg">Carregando lista ou lista vazia. Redirecionando...</p>
                    <Button onClick={() => navigate('/')} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Início
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={`Lista de Compras (Para ${numPessoas} Pessoas)`}>
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
                            disabled={isLoading}
                        >
                            <Save className="h-4 w-4 mr-2" /> Salvar Lista
                        </Button>
                        <Button 
                            onClick={handleCalculate} 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isLoading}
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

                <div className="overflow-x-auto rounded-lg border shadow-md">
                    <Table className="min-w-full">
                        <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                            <TableRow>
                                <TableHead className="w-1/4 min-w-[150px]">Item</TableHead>
                                <TableHead className="w-[150px] text-center">Qtd (Unidade)</TableHead>
                                <TableHead className="w-[100px] text-right text-blue-600">Preço Proença (R$)</TableHead>
                                <TableHead className="w-[100px] text-right text-blue-600">Preço Iquegami (R$)</TableHead>
                                <TableHead className="w-[100px] text-right text-blue-600">Preço Max (R$)</TableHead>
                                <TableHead className="w-10 text-center">Remover</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.map((item, index) => (
                                <ListaItemRow 
                                    key={item.id} 
                                    item={item} 
                                    index={index} 
                                    updateItem={updateItem} 
                                    removeItem={removeItem} 
                                />
                            ))}
                        </TableBody>
                        {list.length === 0 && (
                            <TableCaption>Sua lista está vazia. Adicione itens!</TableCaption>
                        )}
                    </Table>
                </div>
            </div>
        </Layout>
    );
};

export default ListaDeCompras;