import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';

interface CallToActionSectionProps {
    handleCreateManualList: () => void;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ handleCreateManualList }) => {
    return (
        <section className="py-12 sm:py-20 bg-blue-600 text-white rounded-lg">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold tracking-tight">Pronto para começar a economizar?</h2>
                <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto">
                    Chega de adivinhar qual supermercado é o mais barato. Crie sua primeira lista agora e veja a diferença no seu bolso.
                </p>
                <Button 
                    onClick={handleCreateManualList} 
                    className="mt-8 bg-white text-blue-600 hover:bg-gray-100 text-lg py-7 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.03]"
                    size="lg"
                >
                    <DollarSign className="h-6 w-6 mr-3" />
                    Criar Minha Primeira Lista Grátis
                </Button>
            </div>
        </section>
    );
};

export default CallToActionSection;