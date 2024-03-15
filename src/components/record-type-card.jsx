import { Card, CardActionArea, CardContent, Typography } from "@mui/material"
import tinycolor from "tinycolor2"

export default function RecordTypeCard(props) {
    const { bg, children, onClick, ...other } = props

    let style = {}
    if (bg) {
        const bgColor = tinycolor(bg)
        style.backgroundColor = bgColor.toString()
    }

    return (
        <Card sx={style}>
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <Typography variant="h6">
                        {children}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}