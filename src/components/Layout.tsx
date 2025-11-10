import React from 'react';
import { MadeWithDyad } from './made-with-dyad';
import { ShoppingCart } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold flex items-center">
                        <ShoppingCart className="mr-2 h-6 w-6" />
                        {title}
                    </h1>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4 sm:p-6">
                {children}
            </main>
            <footer className="p-2 bg-gray-100 dark:bg-gray-800">
                <MadeWithDyad />
            </footer>
        </div>
    );
};

export default Layout;