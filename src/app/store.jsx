import React from 'react'
import { toyService } from '../services/toy.service.js'

const ToyContext = React.createContext(null)

const initialState = {
    toys: [],
    filterBy: { txt: '', inStock: undefined, labels: [], sortBy: 'name', sortDir: 1 },
    isLoading: false
}

function reducer(state, action) {
    if (action.type === 'SET_LOADING') return { ...state, isLoading: action.isLoading }
    if (action.type === 'SET_TOYS') return { ...state, toys: action.toys }
    if (action.type === 'SET_FILTER') return { ...state, filterBy: { ...state.filterBy, ...action.filterBy } }
    return state
}

export function ToyProvider({ children }) {
    const [state, dispatch] = React.useReducer(reducer, initialState)

    function loadToys() {
        dispatch({ type: 'SET_LOADING', isLoading: true })
        return toyService.query(state.filterBy).then(toys => {
            dispatch({ type: 'SET_TOYS', toys })
            dispatch({ type: 'SET_LOADING', isLoading: false })
        })
    }

    function setFilter(filterBy) {
        dispatch({ type: 'SET_FILTER', filterBy })
    }

    function removeToy(id) {
        return toyService.remove(id).then(() => loadToys())
    }

    function saveToy(toy) {
        return toyService.save(toy).then(() => loadToys())
    }

    const value = { state, loadToys, setFilter, removeToy, saveToy }
    return <ToyContext.Provider value={value}>{children}</ToyContext.Provider>
}

export function useToyStore() {
    return React.useContext(ToyContext)
}
