import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

interface HeroSectionProps {
    handleCreateManualList: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ handleCreateManualList }) => {
    return (
        <div className="text-center py-12 sm:py-20 bg-card rounded-xl shadow-2xl border">
            <div className="max-w-3xl mx-auto px-4">
                <ShoppingCart className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                    Compare Preços, Economize de Verdade.
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Crie sua lista de compras e descubra instantaneamente qual supermercado oferece o menor preço total: Proença, Iquegami ou Max.
                </p>
                
                <Button 
                    onClick={handleCreateManualList} 
                    className="bg-green-600 hover:bg-green-700 text-white text-lg py-7 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.03]"
                    size="lg"
                >
                    <DollarSign className="h-6 w-6 mr-3" />
                    Começar a Economizar Agora
                </Button>

                <div className="mt-10 flex justify-center space-x-6 text-muted-foreground">
                    <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="text-sm">Comparação Rápida</span>
                    </div>
                    <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="text-sm">Foco na Economia</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;