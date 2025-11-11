import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home, List, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import UserAuthMenu from './UserAuthMenu';

const navItems = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Lista', href: '/lista', icon: List },
    { name: 'Comparação', href: '/comparacao', icon: TrendingUp },
];

const Header: React.FC = () => {
    const location = useLocation();

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl print-hidden">
            <div className="container mx-auto flex items-center justify-between p-3 rounded-xl
                           bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                
                <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <ShoppingCart className="h-7 w-7 text-blue-600" />
                    <h1 className="hidden sm:block text-xl font-bold tracking-tight">
                        Comparador
                    </h1>
                </Link>

                <nav>
                    <ul className="flex items-center space-x-1 sm:space-x-2">
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
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        )}
                                        title={item.name}
                                    >
                                        <Icon className="h-4 w-4 sm:mr-2" />
                                        <span className="hidden sm:inline">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="flex items-center space-x-1">
                    <UserAuthMenu />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;