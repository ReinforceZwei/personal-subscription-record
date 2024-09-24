import { useCallback, useState } from "react";

/**
 * Use localStorage as React hook
 * @param {string} key Storage item key
 * @param {any} defaultValue Default value when localStorage.getItem return null
 */
export function useLocalStorage(key: string, defaultValue: any = null): [string | null, (value: any) => void] {
    const storageValue = localStorage.getItem(key)
    const value = storageValue === null ? defaultValue : storageValue

    const [state, setState] = useState(value)
    const setter = useCallback((value: string) => {
        localStorage.setItem(key, value)
        setState(() => value)
    }, [key, setState])
    
    return [value, setter]
}
