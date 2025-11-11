import React from 'react';
import { MadeWithDyad } from './made-with-dyad';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    title?: string; 
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 pt-24 sm:pt-28">
                {children}
            </main>
            <footer className="p-2 bg-gray-100 dark:bg-gray-900 print-hidden">
                <MadeWithDyad />
            </footer>
        </div>
    );
};

export default Layout;