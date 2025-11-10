import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Lock, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

const formSchema = z.object({
    email: z.string().email({ message: "Email inválido." }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
    isSignUp: boolean;
    setIsSignUp: (isSignUp: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ isSignUp, setIsSignUp }) => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        
        let error;
        let message;

        if (isSignUp) {
            // Cadastro
            const { error: signUpError } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
            });
            error = signUpError;
            message = "Confirmação enviada! Verifique seu email para ativar sua conta.";
        } else {
            // Login
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });
            error = signInError;
            message = "Login realizado com sucesso!";
        }

        setIsLoading(false);

        if (error) {
            showError(`Erro de autenticação: ${error.message}`);
        } else {
            showSuccess(message);
            if (isSignUp) {
                // Após o cadastro, o usuário precisa confirmar o email, então não navegamos.
                // Podemos voltar para a tela de login para que ele aguarde a confirmação.
                setIsSignUp(false);
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Email" 
                                        {...field} 
                                        className="pl-10 h-10"
                                        type="email"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Senha</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Senha (mínimo 6 caracteres)" 
                                        {...field} 
                                        className="pl-10 h-10"
                                        type="password"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : isSignUp ? (
                        <UserPlus className="h-4 w-4 mr-2" />
                    ) : (
                        <LogIn className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? 'Processando...' : isSignUp ? 'Cadastrar' : 'Entrar'}
                </Button>

                <Button 
                    type="button" 
                    variant="link" 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full text-sm text-gray-500 dark:text-gray-400"
                >
                    {isSignUp ? 'Já tem conta? Faça Login' : 'Não tem conta? Cadastre-se'}
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;