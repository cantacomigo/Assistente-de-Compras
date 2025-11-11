import React, { SetStateAction, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { ItemCompra, ResultadoComparacao } from '@/types/list';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToActionSection from '@/components/CallToActionSection';

interface InicioProps {
    setNumPessoas: (num: number) => void;
    setList: Dispatch<SetStateAction<ItemCompra[]>>;
    setComparisonResult: (result: ResultadoComparacao | null) => void;
    setCurrentListId: (id: string | null) => void;
    setListName: (name: string) => void; // Novo
}

const Index: React.FC<InicioProps> = ({ setNumPessoas, setList, setComparisonResult, setCurrentListId, setListName }) => {
    const navigate = useNavigate();

    const handleCreateManualList = () => {
        setNumPessoas(1); 
        setList([]);
        setComparisonResult(null);
        setCurrentListId(null);
        setListName(`Lista de ${new Date().toLocaleDateString('pt-BR')}`); // Define nome padrão
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

                {/* 4. Seção de Depoimentos */}
                <TestimonialsSection />

                {/* 5. Seção de Chamada para Ação Final */}
                <CallToActionSection handleCreateManualList={handleCreateManualList} />

            </div>
        </Layout>
    );
};

export default Index;