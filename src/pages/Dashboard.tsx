import React from 'react';
import Layout from '@/components/Layout';
import ListasSalvas from '@/components/ListasSalvas';
import ComparacoesSalvas from '@/components/ComparacoesSalvas';
import WelcomeMessage from '@/components/WelcomeMessage';
import { useSession } from '@/contexts/SessionContext';
import { ItemCompra, ResultadoComparacao } from '@/types/list';
import { useNavigate } from 'react-router-dom';
import { Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
    setNumPessoas: (num: number) => void;
    setList: (list: ItemCompra[]) => void;
    setComparisonResult: (result: ResultadoComparacao | null) => void;
    setCurrentListId: (id: string | null) => void;
    setListName: (name: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setNumPessoas, setList, setComparisonResult, setCurrentListId, setListName }) => {
    const { user, isLoading } = useSession();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="max-w-xl mx-auto text-center py-20 space-y-6 bg-card p-8 rounded-lg shadow-lg border">
                    <User className="h-12 w-12 text-red-500 mx-auto" />
                    <h2 className="text-3xl font-bold">Acesso Restrito</h2>
                    <p className="text-lg text-muted-foreground">
                        Você precisa estar logado para acessar o Painel Pessoal. Por favor, faça login no menu superior.
                    </p>
                    <Button onClick={() => navigate('/')} variant="default">
                        Voltar para o Início
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-10">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Painel Pessoal
                </h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Coluna 1: Boas-vindas */}
                    <div className="lg:col-span-1 space-y-6">
                        <WelcomeMessage />
                    </div>

                    {/* Coluna 2 & 3: Listas e Comparações Salvas */}
                    <div className="lg:col-span-2 space-y-8">
                        <ListasSalvas 
                            setNumPessoas={setNumPessoas} 
                            setList={setList}
                            setCurrentListId={setCurrentListId}
                            setListName={setListName}
                        />
                        <ComparacoesSalvas 
                            setList={setList}
                            setComparisonResult={setComparisonResult}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;