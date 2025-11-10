import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home, List, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Lista', href: '/lista', icon: List },
    { name: 'Comparação', href: '/comparacao', icon: TrendingUp },
];

const Header: React.FC = () => {
    const location = useLocation();

    return (
        <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-10">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4">
                
                {/* Logo e Título */}
                <div className="flex items-center mb-3 sm:mb-0">
                    <ShoppingCart className="mr-2 h-7 w-7" />
                    <h1 className="text-xl font-bold tracking-tight">
                        Comparador de Preços
                    </h1>
                </div>

                {/* Navegação */}
                <nav className="w-full sm:w-auto">
                    <ul className="flex justify-center sm:justify-end space-x-1 sm:space-x-4">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            const Icon = item.icon;
                            
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-blue-700 text-white"
                                                : "text-blue-100 hover:bg-blue-500 hover:text-white"
                                        )}
                                    >
                                        <Icon className="h-4 w-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">{item.name}</span>
                                        <span className="sm:hidden">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;