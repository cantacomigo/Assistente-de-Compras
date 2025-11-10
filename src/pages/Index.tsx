import React, { SetStateAction, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import LoginOpcional from '@/components/LoginOpcional';
import ListasSalvas from '@/components/ListasSalvas';
import ComparacoesSalvas from '@/components/ComparacoesSalvas';
import { ItemCompra, ResultadoComparacao } from '@/types/list';

interface InicioProps {
    setNumPessoas: (num: number) => void;
    setList: Dispatch<SetStateAction<ItemCompra[]>>;
    setComparisonResult: (result: ResultadoComparacao | null) => void;
}

const Index: React.FC<InicioProps> = ({ setNumPessoas, setList, setComparisonResult }) => {
    const navigate = useNavigate();

    const handleCreateManualList = () => {
        setNumPessoas(1); 
        setList([]); // Garante que a lista global está vazia
        setComparisonResult(null); // Limpa resultados anteriores
        navigate('/lista'); 
    };

    return (
        <Layout>
            <div className="max-w-lg mx-auto">
                <Card className="shadow-lg border-t-4 border-blue-500">
                    <CardHeader>
                        <CardTitle className="text-3xl text-blue-700 dark:text-blue-400">
                            Economize no Supermercado!
                        </CardTitle>
                        <CardDescription>
                            Crie sua lista de compras e compare os preços entre Proença, Iquegami e Max.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            onClick={handleCreateManualList} 
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 transition-all duration-300"
                        >
                            <Edit className="h-6 w-6 mr-2" />
                            Criar Nova Lista de Compras
                        </Button>
                        
                        <LoginOpcional />
                    </CardContent>
                </Card>
                
                <ListasSalvas 
                    setNumPessoas={setNumPessoas} 
                    setList={setList}
                />
                <ComparacoesSalvas />
            </div>
        </Layout>
    );
};

export default Index;