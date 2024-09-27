import {
    Autocomplete, Box, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, FormControl, IconButton,
    InputAdornment, InputLabel, MenuItem, Select, TextField,
    Card, CardContent, Typography, Tooltip,
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import { useState, useMemo, useEffect } from "react"
import { useGetUserSettingsQuery } from "../../redux/userSettingsSlice";
import { useGetCurrencyRateQuery } from "../../redux/currencySlice"
import commonCurrency from "../../commonCurrency"
import fx from "money"
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close'
import { useLocalStorage } from "../../vendors/localStorageHook";

interface CurrencyCalculatorModalProps {
    onResult?: (price: number) => void
    onClose: () => void
    acceptResult?: boolean
}

export default function CurrencyCalculatorModal(props: CurrencyCalculatorModalProps) {
    const { onResult, onClose, acceptResult = false } = props

    const { data: userSettings } = useGetUserSettingsQuery()
    const { data: currencyRate } = useGetCurrencyRateQuery()

    const favCurrency = userSettings?.fav_currency || []

    const [source, setSource] = useLocalStorage('calc_last_currency_source', '')
    const [dest, setDest] = useLocalStorage('calc_last_currency_dest', '')

    const [internalShow, setInternalShow] = useState(true)
    const [sourcePrice, setSourcePrice] = useState('')

    const destPrice = source && dest && sourcePrice 
        ? Math.round(
            (fx.convert(
                sourcePrice,
                { from: source.toLowerCase(), to: dest.toLowerCase() }
            ) + Number.EPSILON) * 100
        ) / 100 
        : 0

    const [copySucessMsg, setCopySucessMsg] = useState(false)
    const handleCopy = () => {
        if (destPrice) {
            navigator.clipboard.writeText(destPrice.toString()).then(() => {
                setCopySucessMsg(true)
                setTimeout(() => {
                    setCopySucessMsg(false)
                }, 1000)
            })
        }
    }

    useEffect(() => {
        if (currencyRate) {
            fx.rates = {...currencyRate.rates}
            fx.base = currencyRate.base
        }
    }, [currencyRate])

    const swapSource = () => {
        const tmp = source
        setSource(dest)
        setDest(tmp)
    }

    return (
        <Dialog
            open={internalShow}
            onClose={() => setInternalShow(false)}
            fullWidth={true}
            maxWidth='sm'
            sx={{
                '& .MuiDialog-container': {
                    'alignItems': 'flex-start'
                }
            }}
            TransitionProps={{
                onExited: onClose,
            }}
        >
            <DialogTitle>
                貨幣計算
                <IconButton
                    onClick={() => setInternalShow(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={1} sx={{mt:1}}>
                    <Grid xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>由貨幣</InputLabel>
                            <Select
                                fullWidth
                                label='由貨幣'
                                value={source}
                                onChange={(e) => {setSource(e.target.value)}}
                            >
                                {favCurrency.map(x => (
                                    <MenuItem key={commonCurrency[x].code} value={commonCurrency[x].code}>{commonCurrency[x].code} - {commonCurrency[x].name}</MenuItem>
                                ))}
                                <MenuItem key={'none'} disabled>更多貨幣請在設定添加</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <TextField
                            value={sourcePrice}
                            onChange={(e) => setSourcePrice(e.target.value)}
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{commonCurrency[source]?.symbol || '$'}</InputAdornment>,
                            }}
                            inputMode={'decimal'}
                            type="number"
                            variant="filled"
                        />
                    </Grid>

                    <Grid xs={12}>
                        <Box display='flex' justifyContent='center'>
                            <IconButton onClick={() => swapSource()}><ImportExportIcon /></IconButton>
                        </Box>
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>轉換到</InputLabel>
                            <Select
                                fullWidth
                                label='轉換到'
                                value={dest}
                                onChange={(e) => {setDest(e.target.value)}}
                            >
                                {favCurrency.map(x => (
                                    <MenuItem key={commonCurrency[x].code} value={commonCurrency[x].code}>{commonCurrency[x].code} - {commonCurrency[x].name}</MenuItem>
                                ))}
                                <MenuItem key={'none'} disabled>更多貨幣請在設定添加</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid xs={12} sm={6}>
                        <Box display='flex' alignItems='center' justifyContent='space-between' height='100%'>
                            <Typography variant='h5' sx={{whiteSpace: 'nowrap'}}>{commonCurrency[dest]?.symbol || '$'} {destPrice}</Typography>
                            <Tooltip title='已複製' placement="top" arrow open={copySucessMsg}>
                                <IconButton size="small" color="primary" onClick={handleCopy}>
                                    <ContentCopyIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            {acceptResult && onResult && (
                <DialogActions>
                    <Button onClick={() => onResult(destPrice)}>確定</Button>
                </DialogActions>
            )}
        </Dialog>
    )
}