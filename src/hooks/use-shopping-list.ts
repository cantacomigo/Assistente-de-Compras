import { useState, SetStateAction, Dispatch } from "react";
import { ItemCompra, ResultadoComparacao } from "@/types/list";

interface ShoppingListState {
    list: ItemCompra[];
    comparisonResult: ResultadoComparacao | null;
    numPessoas: number;
}

const initialState: ShoppingListState = {
    list: [],
    comparisonResult: null,
    numPessoas: 1,
};

export function useShoppingList() {
    const [state, setState] = useState<ShoppingListState>(initialState);

    // Tipagem correta para a função setList
    const setList: Dispatch<SetStateAction<ItemCompra[]>> = (listOrUpdater) => {
        setState(prev => ({ 
            ...prev, 
            list: typeof listOrUpdater === 'function' 
                ? listOrUpdater(prev.list) 
                : listOrUpdater 
        }));
    };
    
    const setComparisonResult = (result: ResultadoComparacao) => setState(prev => ({ ...prev, comparisonResult: result }));
    const setNumPessoas = (num: number) => setState(prev => ({ ...prev, numPessoas: num }));
    const resetState = () => setState(initialState);

    return {
        ...state,
        setList,
        setComparisonResult,
        setNumPessoas,
        resetState,
    };
}