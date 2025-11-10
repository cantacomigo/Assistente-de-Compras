import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Trash2, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { formatBRL } from '@/utils/format';
import { ResultadoComparacao, ItemCompra } from '@/types/list';

interface SavedComparison {
    id: string;
    created_at: string;
    total_final: number;
    melhor_supermercado: string;
    comparison_data: {
        list: ItemCompra[];
        result: ResultadoComparacao;
    };
}

interface ComparacoesSalvasProps {
    setList: Dispatch<SetStateAction<ItemCompra[]>>;
    setComparisonResult: (result: ResultadoComparacao | null) => void;
}

const ComparacoesSalvas: React.FC<ComparacoesSalvasProps> = ({ setList, setComparisonResult }) => {
    const { user, isLoading: isSessionLoading } = useSession();
    const navigate = useNavigate();
    const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchComparisons = async () => {
        if (!user) return;

        setIsLoading(true);
        const { data, error } = await supabase
            .from('comparisons')
            .select('id, created_at, total_final, melhor_supermercado, comparison_data')
            .order('created_at', { ascending: false });

        setIsLoading(false);

        if (error) {
            console.error("Erro ao carregar comparações:", error);
            showError("Erro ao carregar suas comparações salvas.");
        } else {
            setComparisons(data as SavedComparison[]);
        }
    };

    useEffect(() => {
        if (user) {
            fetchComparisons();
        } else {
            setComparisons([]);
        }
    }, [user]);

    const handleLoadComparison = (comparison: SavedComparison) => {
        // 1. Carrega a lista de itens no estado global
        setList(comparison.comparison_data.list);
        
        // 2. Carrega o resultado da comparação no estado global
        setComparisonResult(comparison.comparison_data.result);
        
        showSuccess(`Comparação de ${new Date(comparison.created_at).toLocaleDateString('pt-BR')} carregada.`);
        
        // 3. Navega para a página de comparação
        navigate('/comparacao');
    };

    const handleDeleteComparison = async (comparisonId: string) => {
        if (!window.confirm(`Tem certeza que deseja deletar esta comparação?`)) {
            return;
        }

        const { error } = await supabase
            .from('comparisons')
            .delete()
            .eq('id', comparisonId);

        if (error) {
            showError("Erro ao deletar comparação.");
        } else {
            showSuccess(`Comparação deletada com sucesso.`);
            setComparisons(prev => prev.filter(comp => comp.id !== comparisonId));
        }
    };

    if (isSessionLoading || !user) {
        return null; // Não mostra se não estiver logado ou carregando
    }

    return (
        <Card className="mt-8 shadow-lg border-t-4 border-blue-500">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center text-blue-700 dark:text-blue-400">
                    <TrendingUp className="h-6 w-6 mr-2" /> Minhas Comparações Salvas
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                ) : comparisons.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        Você ainda não salvou nenhuma comparação de preços.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {comparisons.map((comp) => (
                            <div 
                                key={comp.id} 
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div>
                                    <p className="font-medium truncate">
                                        Compra de {new Date(comp.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                    <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                        Melhor: {comp.melhor_supermercado} ({formatBRL(comp.total_final)})
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Itens: {comp.comparison_data.list.length}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleLoadComparison(comp)}
                                    >
                                        Visualizar <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => handleDeleteComparison(comp.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ComparacoesSalvas;