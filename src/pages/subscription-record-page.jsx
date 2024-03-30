import Grid from '@mui/material/Unstable_Grid2'
import { Box, Card, CardContent, Typography } from "@mui/material";



export default function SubscriptionRecordPage() {
    return (
        <Box sx={{mb: 10, mt: 1}}>
            <Grid container columns={{ xs: 8, sm: 12 }} spacing={1}>
                <Grid xs={4}>
                    <Card>
                        <CardContent>
                            <Typography>Total</Typography>
                            <Typography variant='h5'>$123</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={4}>
                    <Card>
                        <CardContent>
                            <Typography>Balance</Typography>
                            <Typography variant='h5'>$123</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}