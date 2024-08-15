import { useCallback, useState } from "react";

/**
 * Use localStorage as React hook
 * @param {string} key Storage item key
 * @param {any} defaultValue Default value when localStorage.getItem return null
 * @returns {[string | null, (any) => void]}
 */
export function useLocalStorage(key, defaultValue = null) {
    const storageValue = localStorage.getItem(key)
    const value = storageValue === null ? defaultValue : storageValue

    const [state, setState] = useState(value)
    const setter = useCallback((value) => {
        localStorage.setItem(key, value)
        setState(() => value)
    }, [key, setState])
    
    return [value, setter]
}
