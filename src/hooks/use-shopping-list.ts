import { useState } from "react";
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

    const setList = (list: ItemCompra[]) => setState(prev => ({ ...prev, list }));
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