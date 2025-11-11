import React, { useState } from 'react';
import { LogIn, LogOut, User as UserIcon, Loader2 } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import { Avatar, AvatarFallback } from './ui/avatar';

const UserAuthMenu: React.FC = () => {
    const { user, isLoading } = useSession();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showError("Erro ao sair.");
        } else {
            showSuccess("Você saiu com sucesso.");
        }
    };

    if (isLoading) {
        return <Button variant="ghost" size="icon" disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>;
    }

    if (user) {
        const userEmail = user.email || 'Usuário';
        // Tenta usar o primeiro nome do metadata, se disponível, senão usa a parte do email antes do @
        const displayName = user.user_metadata?.first_name || userEmail.split('@')[0];
        
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            {/* Usando AvatarFallback com a primeira letra do nome/email */}
                            <AvatarFallback className="bg-blue-600 text-white text-sm">
                                {displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {userEmail}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Not logged in: Show Login button that opens a Dialog
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3">
                    <LogIn className="h-4 w-4 mr-2" /> Entrar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-blue-600" /> Acesso à Conta
                    </DialogTitle>
                </DialogHeader>
                <LoginForm />
            </DialogContent>
        </Dialog>
    );
};

export default UserAuthMenu;