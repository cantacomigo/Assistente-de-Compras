import { useState, SetStateAction, Dispatch, useCallback } from "react";
import { ItemCompra, ResultadoComparacao } from "@/types/list";

interface ShoppingListState {
    list: ItemCompra[];
    comparisonResult: ResultadoComparacao | null;
    numPessoas: number;
    currentListId: string | null; // Novo campo para rastrear o ID da lista salva
    listName: string; // Novo campo para o nome da lista
}

const initialState: ShoppingListState = {
    list: [],
    comparisonResult: null,
    numPessoas: 1,
    currentListId: null,
    listName: `Lista de ${new Date().toLocaleDateString('pt-BR')}`,
};

export function useShoppingList() {
    const [state, setState] = useState<ShoppingListState>(initialState);

    // Tipagem correta para a função setList
    const setList: Dispatch<SetStateAction<ItemCompra[]>> = useCallback((listOrUpdater) => {
        setState(prev => ({ 
            ...prev, 
            list: typeof listOrUpdater === 'function' 
                ? listOrUpdater(prev.list) 
                : listOrUpdater 
        }));
    }, []);
    
    const setComparisonResult = useCallback((result: ResultadoComparacao | null) => setState(prev => ({ ...prev, comparisonResult: result })), []);
    const setNumPessoas = useCallback((num: number) => setState(prev => ({ ...prev, numPessoas: num })), []);
    const setCurrentListId = useCallback((id: string | null) => setState(prev => ({ ...prev, currentListId: id })), []);
    const setListName = useCallback((name: string) => setState(prev => ({ ...prev, listName: name })), []);
    const resetState = useCallback(() => setState(initialState), []);

    return {
        ...state,
        setList,
        setComparisonResult,
        setNumPessoas,
        setCurrentListId, 
        setListName, // Exportando a nova função
        resetState,
    };
}