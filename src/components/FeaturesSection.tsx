import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListPlus, Calculator, Save } from 'lucide-react';

const features = [
    {
        icon: <ListPlus className="h-8 w-8 text-blue-500" />,
        title: "Listas Inteligentes",
        description: "Crie e personalize suas listas de compras com facilidade. Adicione itens, quantidades e categorias para uma organização perfeita."
    },
    {
        icon: <Calculator className="h-8 w-8 text-green-500" />,
        title: "Comparação Instantânea",
        description: "Insira os preços dos produtos nos supermercados Proença, Iquegami e Max para ver o total de cada um e descobrir a opção mais barata."
    },
    {
        icon: <Save className="h-8 w-8 text-purple-500" />,
        title: "Salve e Reutilize",
        description: "Faça login para salvar suas listas e comparações. Acesse seu histórico a qualquer momento e reutilize listas para economizar tempo."
    }
];

const FeaturesSection: React.FC = () => {
    return (
        <section className="py-12 sm:py-16">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight">Tudo que você precisa para economizar</h2>
                <p className="mt-2 text-lg text-muted-foreground">Funcionalidades pensadas para facilitar sua vida e seu bolso.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="text-center">
                        <CardHeader>
                            <div className="mx-auto bg-secondary p-3 rounded-full w-fit">
                                {feature.icon}
                            </div>
                            <CardTitle className="mt-4">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;