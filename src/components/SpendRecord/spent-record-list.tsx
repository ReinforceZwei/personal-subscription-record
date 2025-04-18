import { useState, useMemo, Fragment, useEffect } from 'react'
import _ from 'lodash-es'
import { DateTime } from 'luxon'
import { Box, Divider, Chip, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import AirIcon from '@mui/icons-material/Air';
import { sumBy } from '../../vendors/fixedPointMath'
import RecordTypeChip from '../RecordType/record-type-chip'
import RecordDetailModal from '../RecordModal/record-detail-modal'
import { SpentRecord } from '../../services/pocketbase';


interface SpentRecordListProps {
    records: SpentRecord[]
}

export default function SpentRecordList(props: SpentRecordListProps) {
    const { records } = props

    const [detailModal, setDetailModal] = useState<{ record: SpentRecord | null, open: Boolean }>({
        record: null,
        open: false,
    })

    // Group raw records by date (year-month-day)
    const groupedRecords = useMemo(() => {
        return _.chain(records)
            .groupBy(x => DateTime.fromSQL(x.created).toLocaleString())
            .map((v, k) => ({ date: k, records: v, sum: sumBy(v, x => x.price) }))
            .value()
    }, [records])

    useEffect(() => {
        // Also update record for opened modal when records changed
        if (detailModal.open) {
            const newRecord = records.find((record) => record.id === detailModal.record?.id)
            setDetailModal({
                ...detailModal,
                record: newRecord!
            })
        }
    }, [records])

    const handleRecordClick = (record: SpentRecord) => {
        setDetailModal({
            open: true,
            record: record,
        })
    }

    const handleCloseDetailModal = () => {
        setDetailModal({
            ...detailModal,
            open: false
        })
    }


    return (
        <Box mt={1}>
            {!groupedRecords.length && (
                <Stack direction='row' justifyContent='center'>
                    <AirIcon />
                    <Typography sx={{
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}>沒有記錄 </Typography>
                </Stack>
                
            )}
            {groupedRecords.map(({ date, records, sum }) => (
                <Box key={date}>
                    <Divider><Chip label={date} size='small' /><Chip label={`$${sum}`} size='small' color="primary" variant="outlined" /></Divider>
                    <List>
                        {records.map((record, i, { length }) => (
                            <Fragment key={record.id} >
                            <ListItemButton key={record.id} onClick={() => handleRecordClick(record)}>
                                <RecordTypeChip label={record.expand?.type.name} bg={record.expand?.type.color} sx={{mr: 1}} />
                                <ListItemText primary={record.name} secondary={DateTime.fromSQL(record.created).toLocaleString(DateTime.TIME_SIMPLE)} />
                                <span>${record.price}</span>
                            </ListItemButton>
                            { (length - 1 !== i)&&<Divider variant='inset' key={record.id + '_Divider'}></Divider>}
                            </Fragment>
                        ))}
                    </List>
                </Box>
            ))}

            <RecordDetailModal open={detailModal.open} onClose={handleCloseDetailModal} record={detailModal.record} />
        </Box>
    )
}