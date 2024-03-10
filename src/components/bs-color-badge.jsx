import { Badge } from "react-bootstrap";
import tinycolor from "tinycolor2";

export default function BsColorBadge(props) {
    const { bg, children, className, ...others } = props
    let style = {
        'backgroundColor': '#000',
        '--bs-badge-color': '#fff'
    }
    if (bg) {
        const bgColor = tinycolor(bg)
        style['backgroundColor'] = bgColor.toString()
        style['--bs-badge-color'] = bgColor.isLight() ? tinycolor('black').toString() : tinycolor('white').toString()
    }

    return (
        <span className={'badge ' + className} style={style} {...others}>{children}</span>
    )
}