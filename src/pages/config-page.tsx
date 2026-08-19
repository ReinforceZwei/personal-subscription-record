import { useMediaQuery } from "@mui/material"
import MobileLayout from "./config-pages/layouts/mobile-layout"
import DesktopLayout from "./config-pages/layouts/desktop-layout"

export type ConfigPages = 'type' | 'payment' | 'preference' | 'budget' | 'preset' | 'about'

export default function ConfigPage() {
    const isMobileScreen = useMediaQuery('(max-width: 600px)')

    if (isMobileScreen) {
        return <MobileLayout />
    }
    return <DesktopLayout />
}