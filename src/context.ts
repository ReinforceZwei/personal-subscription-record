import React from 'react'
import PocketBase from 'pocketbase'

export const PocketBaseContext = React.createContext<PocketBase | null>(null)