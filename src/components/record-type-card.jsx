import { Card, CardActionArea, CardContent, Typography } from "@mui/material"
import tinycolor from "tinycolor2"

export default function RecordTypeCard(props) {
    const { bg, children, onClick, colorTransition, weight, ...other } = props

    let style = {
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
                        <Typography variant="caption">Weight: {weight}</Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}