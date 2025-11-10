import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ListPlus, Edit } from 'lucide-react';
import { gerarListaInicial } from '@/utils/list-generator';
import LoginOpcional from '@/components/LoginOpcional';
import ListasSalvas from '@/components/ListasSalvas';
import ComparacoesSalvas from '@/components/ComparacoesSalvas';
import { showError } from '@/utils/toast';

interface InicioProps {
    setNumPessoas: (num: number) => void;
}

const Index: React.FC<InicioProps> = ({ setNumPessoas }) => {
    const [numPessoasInput, setNumPessoasInput] = useState(1);
    const navigate = useNavigate();

    const handleGenerateList = (e: React.FormEvent) => {
        e.preventDefault();
        
        const numPessoas = Math.max(1, Math.min(10, numPessoasInput));
        
        if (isNaN(numPessoas) || numPessoas < 1) {
            showError("Por favor, insira um número válido de pessoas (mínimo 1).");
            return;
        }

        const listaGerada = gerarListaInicial(numPessoas);
        
        setNumPessoas(numPessoas);
        
        // Navega para a tela de lista, passando a lista gerada via state do router
        navigate('/lista', { state: { initialList: listaGerada } });
    };

    const handleCreateManualList = () => {
        setNumPessoas(1); // Define o padrão de 1 pessoa para lista manual
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
                            Gere sua lista de compras e compare os preços entre Proença, Iquegami e Max.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleGenerateList} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="numPessoas" className="text-lg flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-green-600" />
                                    Número de pessoas na família:
                                </Label>
                                <Input
                                    id="numPessoas"
                                    type="number"
                                    min={1}
                                    max={10}
                                    defaultValue={1}
                                    value={numPessoasInput}
                                    onChange={(e) => setNumPessoasInput(parseInt(e.target.value) || 1)}
                                    className="text-center text-xl p-6"
                                />
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 transition-all duration-300"
                            >
                                <ListPlus className="h-6 w-6 mr-2" />
                                Gerar Lista Sugerida
                            </Button>
                        </form>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button 
                                onClick={handleCreateManualList} 
                                variant="outline"
                                className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                                <Edit className="h-5 w-5 mr-2" />
                                Criar Lista Manualmente
                            </Button>
                        </div>
                        
                        <LoginOpcional />
                    </CardContent>
                </Card>
                
                <ListasSalvas setNumPessoas={setNumPessoas} />
                <ComparacoesSalvas />
            </div>
        </Layout>
    );
};

export default Index;