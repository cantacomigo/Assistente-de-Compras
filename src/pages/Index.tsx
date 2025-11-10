import React, { SetStateAction, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoginOpcional from '@/components/LoginOpcional';
import ListasSalvas from '@/components/ListasSalvas';
import ComparacoesSalvas from '@/components/ComparacoesSalvas';
import HeroSection from '@/components/HeroSection';
import { ItemCompra, ResultadoComparacao } from '@/types/list';

interface InicioProps {
    setNumPessoas: (num: number) => void;
    setList: Dispatch<SetStateAction<ItemCompra[]>>;
    setComparisonResult: (result: ResultadoComparacao | null) => void;
    setCurrentListId: (id: string | null) => void; // Novo
}

const Index: React.FC<InicioProps> = ({ setNumPessoas, setList, setComparisonResult, setCurrentListId }) => {
    const navigate = useNavigate();

    const handleCreateManualList = () => {
        setNumPessoas(1); 
        setList([]); // Garante que a lista global está vazia
        setComparisonResult(null); // Limpa resultados anteriores
        setCurrentListId(null); // Zera o ID da lista atual
        navigate('/lista'); 
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-10">
                
                {/* 1. Seção Principal (Hero) */}
                <HeroSection handleCreateManualList={handleCreateManualList} />
                
                {/* 2. Login Opcional */}
                <div className="max-w-lg mx-auto">
                    <LoginOpcional />
                </div>

                {/* 3. Listas e Comparações Salvas */}
                <div className="max-w-lg mx-auto space-y-8">
                    <ListasSalvas 
                        setNumPessoas={setNumPessoas} 
                        setList={setList}
                        setCurrentListId={setCurrentListId} // Novo
                    />
                    <ComparacoesSalvas 
                        setList={setList}
                        setComparisonResult={setComparisonResult}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Index;