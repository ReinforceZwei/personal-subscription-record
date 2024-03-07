import { Button } from "react-bootstrap";
import tinycolor from "tinycolor2";

export default function BsColorButton(props) {
    const { color, bg, children, ...others } = props
    let style = {
        // '--bs-btn-color': 'red',
        // '--bs-btn-bg': 'green',
        // '--bs-btn-hover-color': 'green',
        // '--bs-btn-hover-bg': 'red',
    }
    if (color) {
        const textColor = tinycolor(color)
        style['--bs-btn-color'] = textColor.toString()
        style['--bs-btn-hover-color'] = textColor.darken(10).toString()
        style['--bs-btn-active-color'] = style['--bs-btn-hover-color']
    }
    if (bg) {
        const bgColor = tinycolor(bg)
        const darken10 = bgColor.clone().darken(10)
        const darken20 = bgColor.clone().darken(20)
        style['--bs-btn-bg'] = bgColor.toString()
        style['--bs-btn-border-color'] = bgColor.toString()
        style['--bs-btn-hover-bg'] = darken10.toString()
        style['--bs-btn-hover-border-color'] = darken10.toString()
        style['--bs-btn-active-bg'] = darken20.toString()
        style['--bs-btn-active-border-color'] = darken20.toString()

        if (!color) {
            console.log(bgColor.isLight(), bgColor.getBrightness(), bgColor.toString())
            style['--bs-btn-color'] = bgColor.isLight() ? tinycolor('black').toString() : tinycolor('white').toString()
            style['--bs-btn-hover-color'] = tinycolor(style['--bs-btn-color']).darken(10).toString()
            style['--bs-btn-active-color'] = style['--bs-btn-hover-color']
        }
    }

    return (
        <Button style={style} {...others} >{children}</Button>
    )
}