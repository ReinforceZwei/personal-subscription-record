import { Chip } from "@mui/material"
import tinycolor from "tinycolor2"

export default function RecordTypeChip(props) {
    const { bg, sx, ...other } = props

    let style = {...sx}
    if (bg) {
        const bgColor = tinycolor(bg)
        style.backgroundColor = bgColor.toString()
        style.color = bgColor.isLight() ? 'black' : 'white'
    }

    return (
        <Chip {...other} sx={style} />
    )
}