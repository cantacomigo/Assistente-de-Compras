import React, { SetStateAction, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoginOpcional from '@/components/LoginOpcional';
import ListasSalvas from '@/components/ListasSalvas';
import ComparacoesSalvas from '@/components/ComparacoesSalvas';
import HeroSection from '@/components/HeroSection';
import WelcomeMessage from '@/components/WelcomeMessage';
import { ItemCompra, ResultadoComparacao } from '@/types/list';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/contexts/SessionContext';

interface InicioProps {
    setNumPessoas: (num: number) => void;
    setList: Dispatch<SetStateAction<ItemCompra[]>>;
    setComparisonResult: (result: ResultadoComparacao | null) => void;
    setCurrentListId: (id: string | null) => void;
}

const Index: React.FC<InicioProps> = ({ setNumPessoas, setList, setComparisonResult, setCurrentListId }) => {
    const navigate = useNavigate();
    const { user } = useSession();

    const handleCreateManualList = () => {
        setNumPessoas(1); 
        setList([]); // Garante que a lista global está vazia
        setComparisonResult(null); // Limpa resultados anteriores
        setCurrentListId(null); // Zera o ID da lista atual
        navigate('/lista'); 
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* 1. Seção Principal (Hero) */}
                <HeroSection handleCreateManualList={handleCreateManualList} />
                
                <Separator />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Coluna 1: Login e Boas-vindas */}
                    <div className="lg:col-span-1 space-y-6">
                        <WelcomeMessage />
                        <LoginOpcional />
                    </div>

                    {/* Coluna 2 & 3: Listas e Comparações Salvas */}
                    <div className="lg:col-span-2 space-y-8">
                        {user ? (
                            <>
                                <ListasSalvas 
                                    setNumPessoas={setNumPessoas} 
                                    setList={setList}
                                    setCurrentListId={setCurrentListId}
                                />
                                <ComparacoesSalvas 
                                    setList={setList}
                                    setComparisonResult={setComparisonResult}
                                />
                            </>
                        ) : (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
                                Faça login para visualizar e salvar suas listas e comparações.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Index;