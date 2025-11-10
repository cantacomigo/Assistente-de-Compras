import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import LoginForm from './LoginForm';

const LoginOpcional: React.FC = () => {
    const { user, isLoading } = useSession();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showError("Erro ao sair.");
        } else {
            showSuccess("Você saiu com sucesso.");
        }
    };

    if (isLoading) {
        return (
            <Card className="mt-6 border-gray-200 bg-gray-50/50 dark:bg-gray-800">
                <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-base flex items-center text-gray-500 dark:text-gray-400">
                        <UserIcon className="h-4 w-4 mr-2" /> Status de Login
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1 text-sm text-gray-500">
                    Carregando sessão...
                </CardContent>
            </Card>
        );
    }

    if (user) {
        const userEmail = user.email || 'Usuário';
        return (
            <Card className="mt-6 border-green-200 bg-green-50/50 dark:bg-green-900/20">
                <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-base flex items-center text-green-700 dark:text-green-400">
                        <LogIn className="h-4 w-4 mr-2" /> Logado
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-3 pt-1">
                    <div className="text-sm text-green-800 dark:text-green-300 truncate">
                        {userEmail} (Listas salvas)
                    </div>
                    <Button 
                        onClick={handleLogout} 
                        variant="destructive"
                        size="sm"
                        className="h-8"
                    >
                        <LogOut className="h-4 w-4 mr-1" /> Sair
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-6 border-blue-200 bg-blue-50/50 dark:bg-gray-800">
            <CardHeader className="p-3 pb-1">
                <CardTitle className="text-base flex items-center text-blue-700 dark:text-blue-400">
                    <LogIn className="h-4 w-4 mr-2" /> Autenticação
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-1">
                <LoginForm />
            </CardContent>
            <CardContent className="p-3 pt-0 text-xs text-gray-500 dark:text-gray-400">
                Faça login ou cadastre-se para salvar suas listas e comparações.
            </CardContent>
        </Card>
    );
};

export default LoginOpcional;