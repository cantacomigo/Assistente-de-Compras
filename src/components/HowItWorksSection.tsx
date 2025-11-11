import React from 'react';
import { PencilLine, DollarSign, TrendingUp } from 'lucide-react';

const steps = [
    {
        icon: <PencilLine className="h-10 w-10 text-foreground" />,
        title: "1. Crie sua Lista",
        description: "Comece adicionando todos os itens que você precisa comprar. É rápido e intuitivo."
    },
    {
        icon: <DollarSign className="h-10 w-10 text-foreground" />,
        title: "2. Informe os Preços",
        description: "Preencha os preços de cada item nos supermercados que você costuma frequentar."
    },
    {
        icon: <TrendingUp className="h-10 w-10 text-foreground" />,
        title: "3. Compare e Economize",
        description: "Com um clique, veja qual supermercado oferece o melhor custo-benefício e o valor da sua economia."
    }
];

const HowItWorksSection: React.FC = () => {
    return (
        <section className="py-12 sm:py-16 bg-secondary rounded-lg">
            <div className="container mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight">Como Funciona?</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Economizar nunca foi tão simples. Siga estes 3 passos:</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="p-4 bg-background rounded-full mb-4 shadow-md">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="mt-2 text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;