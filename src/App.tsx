import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ListaDeCompras from "./pages/ListaDeCompras";
import Comparacao from "./pages/Comparacao";
import Dashboard from "./pages/Dashboard"; // Importando Dashboard
import { useShoppingList } from "./hooks/use-shopping-list";
import { SessionContextProvider } from "./contexts/SessionContext";
import { ThemeProvider } from "./components/ThemeProvider";

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
              setCurrentListId={shoppingListState.setCurrentListId}
              setListName={shoppingListState.setListName}
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
              currentListId={shoppingListState.currentListId}
              setCurrentListId={shoppingListState.setCurrentListId}
              listName={shoppingListState.listName}
              setListName={shoppingListState.setListName}
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
        <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              setNumPessoas={shoppingListState.setNumPessoas} 
              setList={shoppingListState.setList}
              setComparisonResult={shoppingListState.setComparisonResult}
              setCurrentListId={shoppingListState.setCurrentListId}
              setListName={shoppingListState.setListName}
            />
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        <Sonner />
        <SessionContextProvider>
          <AppContent />
        </SessionContextProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;