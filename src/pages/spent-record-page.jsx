import { useEffect, useState, useContext } from 'react'
import { PocketBaseContext } from '../main'
import { Card } from 'react-bootstrap'

export default function SpentRecordPage() {
    const pb = useContext(PocketBaseContext)
    const [records, setRecords] = useState([])

    useEffect(() => {
        let pbInit = async () => {
            let result = await pb.collection('spentRecords').getFullList({
                sort: '-created',
                expand: 'type'
            })
            console.log(result)
            setRecords(result)
        }
        pbInit()
    }, [])

    return (
        <div>
            <h1>This is spent record page</h1>
            <div>
                {records.map((record) => (
                    <Card key={record.id}>
                        <Card.Body>{record.name} - ${record.price}</Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    )
}