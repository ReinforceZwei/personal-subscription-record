import { Box, List, ListItem, ListItemButton } from "@mui/material"
import { useEffect, useState } from "react"

export default function ConfigAboutPage() {
    const loadedScripts = Array.from(document.getElementsByTagName('script'))

    const reload = () => {
        window.location.reload()
    }

    const clearCacheAndReload = () => {
        window.location.reload(true)
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
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => reload()}>Reload</ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => clearCacheAndReload()}>Clear Cache and Reload</ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}