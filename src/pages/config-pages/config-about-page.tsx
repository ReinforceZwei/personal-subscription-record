import { Box, List, ListItem, ListItemButton } from "@mui/material"
import { useEffect, useState } from "react"

export default function ConfigAboutPage() {
    const loadedScripts = Array.from(document.getElementsByTagName('script'))
    const [swCount, setSwCount] = useState(0)

    useEffect(() => {
        navigator.serviceWorker.getRegistrations().then((regs) => {
            setSwCount(regs.length)
        })
    }, [])

    const reload = () => {
        window.location.reload()
    }

    const clearCacheAndReload = () => {
        window.location.reload(true)
    }

    const forceSwUpdate = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    registration.update()
                }
            })
        }
    }

    return (
        <Box>
            Loaded Scripts
            <Box>
                <ol>
                { loadedScripts.map((script) => (
                    <li>{script.src || 'Inline-script'}</li>
                ))}
                </ol>
            </Box>
            Built from commit
            <Box>
                <code>{__COMMIT_HASH__}</code>
            </Box>
            <Box>
                Service Workers: {swCount}
            </Box>
            <Box>
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => reload()}>Reload</ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => clearCacheAndReload()}>Clear Cache and Reload</ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => forceSwUpdate()}>Force Service Worker Update</ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}