import { Card, CardActionArea, CardContent, Typography } from "@mui/material"
import { CSSProperties, ReactNode } from "react"
import tinycolor from "tinycolor2"

interface RecordTypeCardProps {
    bg?: string
    children?: ReactNode
    onClick?: () => void
    colorTransition?: number
    weight?: number
}

export default function RecordTypeCard(props: RecordTypeCardProps) {
    const { bg, children, onClick, colorTransition, weight } = props

    let style: CSSProperties = {
        textAlign: 'center'
    }
    if (bg) {
        const bgColor = tinycolor(bg)
        style.backgroundColor = bgColor.toString()
        style.color = bgColor.isLight() ? 'black' : 'white'
    }

    if (colorTransition) {
        style.transition = `background-color ${colorTransition}ms linear, color ${colorTransition}ms linear`
    }

    return (
        <Card sx={style}>
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <Typography variant="h6">
                        {children}
                    </Typography>
                    {weight != undefined && (
                        <Typography variant="caption">權重: {weight}</Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}