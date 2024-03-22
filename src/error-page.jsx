import { Box, Button, Typography } from "@mui/material";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <Box>
            <Typography variant="h4">Application Error</Typography>
            {error.error && (
                <Box>
                    <Typography>{error.error.message}</Typography>
                    <pre>
                        <code>
                            {error.error.stack}
                        </code>
                    </pre>
                </Box>
            )}
            <pre>
                <code>
                    {JSON.stringify(error, null, 4)}
                </code>
            </pre>
            <Button variant="outlined" LinkComponent={Link} to='/'>Back to home page</Button>
        </Box>
    );
}