import { Box, LinearProgress } from "@mui/material"
import { useState, useEffect } from "react"

function clamp(n: number, min: number, max: number) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
}

export default function PageTopProgressBar() {
    const [progress, setProgress] = useState(0);

    const increment = () => {
        setProgress((oldProgress) => {
            console.log(oldProgress)
            if (oldProgress >= 100) {
                return 100;
            }
            if (oldProgress >= 0 && oldProgress < 20) {
                return clamp(oldProgress + 10, 0, 99)
            } else if (oldProgress >= 20 && oldProgress < 50) {
                return clamp(oldProgress + 5, 0, 99)
            } else if (oldProgress >= 50 && oldProgress < 80) {
                return clamp(oldProgress + 1, 0, 99)
            } else {
                return 0
            }
        })
    }

    useEffect(() => {
        setProgress(0)
        increment()
        const timer = setInterval(() => {
            increment();
        }, 200);

        return () => {
            setProgress(100)
            clearInterval(timer);
        };
    }, []);

    return (
        <Box pb='4px'>
            <Box position='absolute' top={0} left={0} width='100%'>
                <LinearProgress variant="determinate" value={progress} sx={{backgroundColor: 'initial'}} />
            </Box>
        </Box>
    )
}