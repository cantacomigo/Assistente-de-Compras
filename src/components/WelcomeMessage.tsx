import React from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Card, CardContent } from '@/components/ui/card';
import { Smile } from 'lucide-react';

const WelcomeMessage: React.FC = () => {
    const { user, isLoading } = useSession();

    if (isLoading) {
        return null;
    }

    const email = user?.email;
    const firstName = user?.user_metadata?.first_name; // Assumindo que o perfil pode ter first_name

    let message = "Bem-vindo(a) ao Comparador de Preços!";
    let subMessage = "Crie sua primeira lista e comece a economizar hoje mesmo.";

    if (email) {
        const displayName = firstName || email.split('@')[0];
        message = `Olá, ${displayName}!`;
        subMessage = "Pronto para economizar? Suas listas e comparações salvas estão abaixo.";
    }

    return (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 shadow-md">
            <CardContent className="p-4 flex items-center space-x-4">
                <Smile className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{message}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{subMessage}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default WelcomeMessage;