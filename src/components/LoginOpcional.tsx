import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, LogIn } from 'lucide-react';
import { Label } from '@/components/ui/label';

const LoginOpcional: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Simulação

    const handleLogin = () => {
        if (email) {
            // Aqui seria a lógica real de login/cadastro com Supabase
            console.log(`Tentativa de login com: ${email}`);
            setIsLoggedIn(true);
            // showSuccess(`Bem-vindo(a), ${email}!`);
        }
    };

    if (isLoggedIn) {
        return (
            <div className="text-sm text-green-600 flex items-center">
                <LogIn className="h-4 w-4 mr-1" /> Logado como: {email} (Funcionalidade de salvar listas ativada)
            </div>
        );
    }

    return (
        <Card className="mt-6 border-blue-200 bg-blue-50/50 dark:bg-gray-800">
            <CardHeader className="p-3 pb-1">
                <CardTitle className="text-base flex items-center text-blue-700 dark:text-blue-400">
                    <Mail className="h-4 w-4 mr-2" /> Login Opcional
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-2 p-3 pt-1">
                <div className="flex-grow">
                    <Label htmlFor="email" className="sr-only">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Seu email para salvar listas"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-9"
                    />
                </div>
                <Button 
                    onClick={handleLogin} 
                    disabled={!email}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-9"
                >
                    Entrar
                </Button>
            </CardContent>
        </Card>
    );
};

export default LoginOpcional;