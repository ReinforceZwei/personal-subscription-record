import { useEffect, useState, useContext } from 'react'
import { PocketBaseContext } from '../main'
import { Card, ListGroup, Stack } from 'react-bootstrap'
import { DateTime } from 'luxon'
import BsColorBadge from '../components/bs-color-badge'

export default function SpentRecordPage() {
    const pb = useContext(PocketBaseContext)
    //const [records, setRecords] = useState([])
    const [groupedRecords, setGroupedRecords] = useState([])

    useEffect(() => {
        (async () => {
            let result = await pb.collection('spentRecords').getFullList({
                sort: '-created',
                expand: 'type,payment'
            })
            console.log(result)
            //setRecords(result)
            let a = result.reduce((prev, curr) => {
                let date = DateTime.fromSQL(curr.created)
                let key = date.toLocaleString()
                if (prev[key]) {
                    prev[key].push(curr)
                } else {
                    prev[key] = [curr]
                }
                return prev
            }, {})
            setGroupedRecords(Object.keys(a).map((date) => {
                return {
                    date,
                    records: a[date],
                }
            }))
        })()
    }, [])

    
    console.log(groupedRecords)

    return (
        <div>
            <h1>This is spent record page</h1>
            <div>
                {groupedRecords.map(({date, records}) => (
                    <>
                    {date}
                    <ListGroup key={date} variant="flush">
                        {records.map((record) => (
                            <ListGroup.Item key={record.id}>
                                <Stack direction='horizontal' gap={2}>
                                    <div><BsColorBadge className="fs-6" bg={record.expand.type.color}>{record.expand.type.name}</BsColorBadge></div>
                                    <Stack>
                                        <Stack direction='horizontal' gap={2}>
                                            <div> {record.name}</div>
                                            
                                        </Stack>
                                        <small className='text-body-secondary'>{DateTime.fromSQL(record.created).toLocaleString(DateTime.TIME_SIMPLE)}</small>
                                    </Stack>
                                    {record.payment && <BsColorBadge bg={record.expand.payment.color}>{record.expand.payment.name}</BsColorBadge>}
                                    <div className='ms-auto'>${record.price}</div>
                                </Stack>
                                
                                {/* {record.created} {record.name} - ${record.price}
                                <BsColorBadge bg={record.expand.type.color}>{record.expand.type.name}</BsColorBadge> */}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    </>
                ))}
                {/* <ListGroup>
                {records.map((record) => (
                    <ListGroup.Item key={record.id}>
                        {record.created} {record.name} - ${record.price}
                    </ListGroup.Item>
                ))}
                </ListGroup> */}
                
            </div>
        </div>
    )
}