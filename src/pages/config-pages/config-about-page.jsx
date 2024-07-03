import { Box, Button } from "@mui/material"




export default function ConfigAboutPage() {
    const loadedScripts = Array.from(document.getElementsByTagName('script'))

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
                <Button variant="contained" onClick={() => clearCacheAndReload()}>Clear Cache and Reload</Button>
            </Box>
        </Box>
    )
}