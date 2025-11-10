import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import LoginOpcional from '@/components/LoginOpcional';
import ListasSalvas from '@/components/ListasSalvas';
import ComparacoesSalvas from '@/components/ComparacoesSalvas';

interface InicioProps {
    setNumPessoas: (num: number) => void;
}

const Index: React.FC<InicioProps> = ({ setNumPessoas }) => {
    const navigate = useNavigate();

    const handleCreateManualList = () => {
        // Define o padrão de 1 pessoa para lista manual (mantido para compatibilidade com o hook de estado, mas não usado na lógica de geração)
        setNumPessoas(1); 
        navigate('/lista', { state: { initialList: [] } }); // Navega com lista vazia
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
                
                {/* O setNumPessoas não é mais relevante para ListasSalvas, mas mantemos a prop por enquanto */}
                <ListasSalvas setNumPessoas={setNumPessoas} />
                <ComparacoesSalvas />
            </div>
        </Layout>
    );
};

export default Index;