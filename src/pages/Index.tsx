import React, { SetStateAction, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoginOpcional from '@/components/LoginOpcional';
import ListasSalvas from '@/components/ListasSalvas';
import ComparacoesSalvas from '@/components/ComparacoesSalvas';
import HeroSection from '@/components/HeroSection';
import WelcomeMessage from '@/components/WelcomeMessage';
import { ItemCompra, ResultadoComparacao } from '@/types/list';
import { useSession } from '@/contexts/SessionContext';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToActionSection from '@/components/CallToActionSection';

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
        setList([]);
        setComparisonResult(null);
        setCurrentListId(null);
        navigate('/lista'); 
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                
                {/* 1. Seção Principal (Hero) */}
                <HeroSection handleCreateManualList={handleCreateManualList} />
                
                {/* 2. Seção de Funcionalidades */}
                <FeaturesSection />

                {/* 3. Seção Como Funciona */}
                <HowItWorksSection />

                {/* 4. Painel do Usuário (Conteúdo dinâmico) */}
                <section>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold tracking-tight">Seu Painel Pessoal</h2>
                        <p className="mt-2 text-lg text-muted-foreground">
                            {user ? "Acesse suas listas e comparações salvas." : "Faça login para salvar seu progresso e acessar suas listas de qualquer lugar."}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
                                <div className="p-10 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg h-full flex flex-col justify-center items-center">
                                    <h3 className="text-xl font-semibold mb-2">Área do Usuário</h3>
                                    <p>Faça login para visualizar e gerenciar suas listas e comparações salvas aqui.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 5. Seção de Depoimentos */}
                <TestimonialsSection />

                {/* 6. Seção de Chamada para Ação Final */}
                <CallToActionSection handleCreateManualList={handleCreateManualList} />

            </div>
        </Layout>
    );
};

export default Index;