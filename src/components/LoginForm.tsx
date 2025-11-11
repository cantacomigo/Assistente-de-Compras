import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Lock, LogIn, Loader2, UserPlus, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

// Esquema de validação base
const formSchema = z.object({
    email: z.string().email({ message: "Email inválido." }),
    // A senha é opcional no esquema base para permitir o Magic Link,
    // mas será validada condicionalmente no onSubmit.
    password: z.string().optional(), 
});

type LoginFormValues = z.infer<typeof formSchema>;

// URL de redirecionamento dinâmica: usa a URL do ambiente (Vercel) ou localhost em dev.
const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    // Fallback para ambiente de desenvolvimento Dyad/Vite
    return "http://localhost:8080";
};

const REDIRECT_URL = getRedirectUrl();

const LoginForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [useMagicLink, setUseMagicLink] = useState(false);
    const [magicLinkSent, setMagicLinkSent] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        // Validação condicional da senha para Login/Cadastro
        if (!useMagicLink) {
            if (!values.password || values.password.length < 6) {
                form.setError('password', {
                    type: 'manual',
                    message: 'A senha é obrigatória e deve ter pelo menos 6 caracteres.',
                });
                return;
            }
        }

        setIsLoading(true);
        
        let error;
        let successMessage;

        if (useMagicLink) {
            // Magic Link (Sign In with OTP)
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email: values.email,
                options: {
                    // Usamos a URL dinâmica
                    emailRedirectTo: REDIRECT_URL, 
                }
            });
            error = otpError;
            successMessage = "Link de acesso enviado! Verifique seu email.";
            setMagicLinkSent(true);

        } else if (isSignUp) {
            // Cadastro (Sign Up)
            const { error: signUpError } = await supabase.auth.signUp({
                email: values.email,
                password: values.password!,
            });
            error = signUpError;
            successMessage = "Cadastro realizado! Verifique seu email para confirmar a conta.";
        } else {
            // Login (Sign In with Password)
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password!,
            });
            error = signInError;
            successMessage = "Login realizado com sucesso!";
        }
        
        setIsLoading(false);

        if (error) {
            // Tratamento de erros específicos do Supabase
            if (error.message.includes('Invalid login credentials')) {
                showError("Credenciais inválidas. Verifique seu email e senha.");
            } else if (error.message.includes('Signups not allowed')) {
                showError("O cadastro está desativado. Por favor, use uma conta existente ou peça ao administrador para habilitar o cadastro.");
            } else if (error.message.includes('Email rate limit exceeded')) {
                showError("Limite de envio de email excedido. Tente novamente mais tarde.");
            } else {
                showError(`Erro de autenticação: ${error.message}`);
            }
        } else {
            showSuccess(successMessage);
        }
    };

    const handleToggleMode = (mode: 'login' | 'signup' | 'magiclink') => {
        form.reset();
        setMagicLinkSent(false);
        if (mode === 'magiclink') {
            setUseMagicLink(true);
            setIsSignUp(false);
        } else {
            setUseMagicLink(false);
            setIsSignUp(mode === 'signup');
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
                
                {/* Campo de Senha (Oculto no Magic Link) */}
                {!useMagicLink && (
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
                                            // Garante que o campo seja controlado, mesmo que o valor inicial seja undefined
                                            value={field.value || ''} 
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                
                {magicLinkSent ? (
                    <div className="text-sm text-center text-green-600 dark:text-green-400 p-2 border border-green-300 rounded">
                        Link enviado! Verifique sua caixa de entrada.
                    </div>
                ) : (
                    <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : useMagicLink ? (
                            <Send className="h-4 w-4 mr-2" />
                        ) : isSignUp ? (
                            <UserPlus className="h-4 w-4 mr-2" />
                        ) : (
                            <LogIn className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? `Aguarde...` : (useMagicLink ? 'Enviar Link de Acesso' : (isSignUp ? 'Cadastrar' : 'Entrar'))}
                    </Button>
                )}
            </form>

            {/* Botões de Alternância de Modo */}
            <div className="flex flex-col space-y-2 mt-3">
                <Button
                    variant="link"
                    onClick={() => handleToggleMode(isSignUp ? 'login' : 'signup')}
                    className="w-full text-sm p-0 h-auto text-gray-500 dark:text-gray-400 hover:text-blue-600"
                    disabled={isLoading}
                >
                    {isSignUp ? 'Já tem conta? Faça Login' : 'Não tem conta? Cadastre-se'}
                </Button>
                
                <Button
                    variant="link"
                    onClick={() => handleToggleMode(useMagicLink ? 'login' : 'magiclink')}
                    className="w-full text-sm p-0 h-auto text-gray-500 dark:text-gray-400 hover:text-blue-600"
                    disabled={isLoading}
                >
                    {useMagicLink ? 'Usar Email/Senha' : 'Acessar sem Senha (Magic Link)'}
                </Button>
            </div>
        </Form>
    );
};

export default LoginForm;