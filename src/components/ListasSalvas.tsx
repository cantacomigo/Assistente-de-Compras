import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, List, Trash2, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { ItemCompra } from '@/types/list';

interface SavedList {
    id: string;
    name: string;
    num_pessoas: number;
    created_at: string;
    list_data: ItemCompra[];
}

interface ListasSalvasProps {
    setNumPessoas: (num: number) => void;
    setList: Dispatch<SetStateAction<ItemCompra[]>>;
    setCurrentListId: (id: string | null) => void;
    setListName: (name: string) => void; // Novo
}

const ListasSalvas: React.FC<ListasSalvasProps> = ({ setNumPessoas, setList, setCurrentListId, setListName }) => {
    const { user, isLoading: isSessionLoading } = useSession();
    const navigate = useNavigate();
    const [lists, setLists] = useState<SavedList[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLists = async () => {
        if (!user) return;

        setIsLoading(true);
        const { data, error } = await supabase
            .from('shopping_lists')
            .select('id, name, num_pessoas, created_at, list_data')
            .order('created_at', { ascending: false });

        setIsLoading(false);

        if (error) {
            console.error("Erro ao carregar listas:", error);
            showError("Erro ao carregar suas listas salvas.");
        } else {
            setLists(data as SavedList[]);
        }
    };

    useEffect(() => {
        if (user) {
            fetchLists();
        } else {
            setLists([]);
        }
    }, [user]);

    const handleLoadList = (list: SavedList) => {
        setNumPessoas(list.num_pessoas);
        setList(list.list_data); // Carrega a lista no estado global
        setCurrentListId(list.id); // Define o ID da lista atual
        setListName(list.name); // Define o nome da lista
        showSuccess(`Lista "${list.name}" carregada com sucesso.`);
        navigate('/lista'); // Navega para a página de lista
    };

    const handleDeleteList = async (listId: string, listName: string) => {
        if (!window.confirm(`Tem certeza que deseja deletar a lista "${listName}"?`)) {
            return;
        }

        const { error } = await supabase
            .from('shopping_lists')
            .delete()
            .eq('id', listId);

        if (error) {
            showError("Erro ao deletar lista.");
        } else {
            showSuccess(`Lista "${listName}" deletada com sucesso.`);
            setLists(prev => prev.filter(list => list.id !== listId));
        }
    };

    if (isSessionLoading) {
        return null; // Espera o status da sessão
    }

    if (!user) {
        return null; // Não mostra se não estiver logado
    }

    return (
        <Card className="mt-8 shadow-lg border-t-4 border-green-500">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center text-green-700 dark:text-green-400">
                    <List className="h-6 w-6 mr-2" /> Minhas Listas Salvas
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                    </div>
                ) : lists.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        Você ainda não salvou nenhuma lista.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {lists.map((list) => (
                            <div 
                                key={list.id} 
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div>
                                    <p className="font-medium truncate">{list.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(list.created_at).toLocaleDateString('pt-BR')} | {list.num_pessoas} Pessoas
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleLoadList(list)}
                                    >
                                        Carregar <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => handleDeleteList(list.id, list.name)}
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

export default ListasSalvas;