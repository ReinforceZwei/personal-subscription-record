import { useContext, useEffect, useState } from "react"
import { PocketBaseContext } from "../main"
import { PAYMENT_METHOD_COL, SPENT_RECORD_COL, SPENT_TYPE_COL, SPENT_RECORD_NAME_COL } from "../services/pocketbase"
import { Button, Card, Modal, Form, InputGroup, Row, Col, Badge } from "react-bootstrap"
import { useForm } from "react-hook-form"
import BsColorButton from "../components/bs-color-button"
import BsColorBadge from "../components/bs-color-badge"

export default function QuickCreatePage() {
    const pb = useContext(PocketBaseContext)

    const [types, setTypes] = useState([])
    const [payments, setPayments] = useState([])
    const [selectedType, setSelectedType] = useState({})
    const [suggestedName, setSuggestedName] = useState([])

    const [showModal, setShowModal] = useState(false)

    const { register, handleSubmit, reset } = useForm()

    useEffect(() => {
        (async () => {
            let spentTypes = await pb.collection(SPENT_TYPE_COL).getFullList({
                sort: '+name',
            })
            setTypes(spentTypes)

            let paymentMethods = await pb.collection(PAYMENT_METHOD_COL).getFullList({
                sort: '+name',
            })
            setPayments(paymentMethods)
        })()
        
    }, [])

    useEffect(() => {
        (async () => {
            let names = await pb.collection(SPENT_RECORD_NAME_COL).getFullList({
                sort: '+name',
                filter: `type = '${selectedType.id}'`
            })
            setSuggestedName(names)
        })()
    }, [selectedType])

    const handleSelectType = (type) => {
        setShowModal(true)
        setSelectedType(type)
        console.log(type)
    }

    const onCreate = (data) => {
        console.log(data)
        let final = {
            type: selectedType.id,
            owned_by: pb.authStore.model.id,
            ...data,
        }
        pb.collection(SPENT_RECORD_COL).create(final).then(() => {
            alert('created')
            setShowModal(false)
            reset()
        })
        .catch((err) => {
            console.error(err)
            alert(err)
        })
    }

    return (
        <div>
            <h1>This is quick create page</h1>
            <div className="container text-center">
                <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4">
                {types.map((type) => (
                    <div className="d-grid mt-1 mb-1" key={type.id}>
                        {/* <Button size="lg" variant="outline-secondary" className="pt-4 pb-4" onClick={() => handleSelectType(type)}>{type.name}</Button> */}
                        <BsColorButton 
                            size="lg"
                            className="pt-4 pb-4"
                            variant="outline-secondary"
                            bg={type.color}
                            onClick={() => handleSelectType(type)}
                        >
                            {type.name}
                        </BsColorButton>
                    </div>
                    
                ))}
                
                </div>
                
            </div>

            <Modal show={showModal}  onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title><BsColorBadge className="fs-5" bg={selectedType.color}>{selectedType.name}</BsColorBadge> Create Record</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit(onCreate)}>
                    <Modal.Body>
                        <Row>
                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control type="number" {...register("price", { required: true })} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>Payment</Form.Label>
                                <Form.Select {...register("payment", { required: true })}>
                                    {payments.map((payment) => (
                                        <option value={payment.id} key={payment.id}>{payment.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        
                        {/* <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" {...register("name", { required: true })} />
                        </Form.Group> */}
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="search" list="data" {...register("name", { required: true })} autoComplete="off" />
                            <datalist id='data'>
                                {suggestedName.map(({ name }) => (
                                    <option key={name} value={name}></option>
                                ))}
                            </datalist>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} {...register("description")} />
                        </Form.Group>
                            
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Create
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}