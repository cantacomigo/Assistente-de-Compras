import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ListPlus } from 'lucide-react';
import { gerarListaInicial } from '@/utils/list-generator';
import LoginOpcional from '@/components/LoginOpcional';
import { toast } from '@/utils/toast';

interface InicioProps {
    setNumPessoas: (num: number) => void;
}

const Inicio: React.FC<InicioProps> = ({ setNumPessoas }) => {
    const [numPessoasInput, setNumPessoasInput] = useState(1);
    const navigate = useNavigate();

    const handleGenerateList = (e: React.FormEvent) => {
        e.preventDefault();
        
        const numPessoas = Math.max(1, Math.min(10, numPessoasInput));
        
        if (isNaN(numPessoas) || numPessoas < 1) {
            toast.showError("Por favor, insira um número válido de pessoas (mínimo 1).");
            return;
        }

        const listaGerada = gerarListaInicial(numPessoas);
        
        setNumPessoas(numPessoas);
        
        // Navega para a tela de lista, passando a lista gerada via state do router
        navigate('/lista', { state: { initialList: listaGerada } });
    };

    return (
        <Layout title="Comparador de Preços Supermercados">
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
                        <form onSubmit={handleGenerateList} className="space-y-6">
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
                                Gerar Lista de Compras
                            </Button>
                        </form>
                        
                        <LoginOpcional />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Inicio;