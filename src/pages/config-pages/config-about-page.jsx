import { Box } from "@mui/material"




export default function ConfigAboutPage() {
    const loadedScripts = Array.from(document.getElementsByTagName('script'))

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
        </Box>
    )
}