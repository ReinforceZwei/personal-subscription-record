import React from 'react'
import PocketBase from 'pocketbase'
import { ColorMode } from './themes'

export const PocketBaseContext = React.createContext<PocketBase | null>(null)

export const ThemeContext = React.createContext<{colorMode: ColorMode, setColorMode: (mode: ColorMode) => void}>({
    colorMode: 'system',
    setColorMode: () => {}
})