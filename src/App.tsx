import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ListaDeCompras from "./pages/ListaDeCompras";
import Comparacao from "./pages/Comparacao";
import { useShoppingList } from "./hooks/use-shopping-list";
import { SessionContextProvider } from "./contexts/SessionContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const shoppingListState = useShoppingList();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <Index 
              setNumPessoas={shoppingListState.setNumPessoas} 
              setList={shoppingListState.setList}
              setComparisonResult={shoppingListState.setComparisonResult}
              setCurrentListId={shoppingListState.setCurrentListId} // Novo
            />
          } 
        />
        <Route 
          path="/lista" 
          element={
            <ListaDeCompras 
              list={shoppingListState.list} 
              setList={shoppingListState.setList} 
              setComparisonResult={shoppingListState.setComparisonResult}
              numPessoas={shoppingListState.numPessoas}
              currentListId={shoppingListState.currentListId} // Novo
              setCurrentListId={shoppingListState.setCurrentListId} // Novo
            />
          } 
        />
        <Route 
          path="/comparacao" 
          element={
            <Comparacao 
              list={shoppingListState.list} 
              comparisonResult={shoppingListState.comparisonResult}
            />
          } 
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SessionContextProvider>
        <AppContent />
      </SessionContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;