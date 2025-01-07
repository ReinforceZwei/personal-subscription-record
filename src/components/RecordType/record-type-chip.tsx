import { Chip, ChipProps, SxProps } from "@mui/material"
import { CSSProperties } from "react"
import tinycolor from "tinycolor2"

interface RecordTypeChipProps {
    bg?: string
    sx?: SxProps
}

export default function RecordTypeChip(props: RecordTypeChipProps & ChipProps) {
    const { bg, sx, ...other } = props

    let style: any = {...sx}
    if (bg) {
        const bgColor = tinycolor(bg)
        style.backgroundColor = bgColor.toString()
        style.color = bgColor.isLight() ? 'black' : 'white'
    }

    return (
        <Chip {...other} sx={style} />
    )
}