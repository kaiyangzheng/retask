import React, {useState} from 'react'
import { 
    Modal,
    Form,
    ButtonToolbar,
    Button,
    Input
} from 'rsuite';
import axiosInstance from '../../../utils/axiosAPI';

export default function AddModal({openAddModal, setOpenAddModal, reloadData, setReloadData, setOpenReviewModal, setReviewTaskId, setReviewSessionId}) {
  const [task, setTask] = useState({
    'name': '',
    'description': ''
  })
  const handleClose = () => {
    setOpenAddModal(false);
    setTask({
        'name': '',
        'description': ''
    })
  }

  const handleAddTask = async () => {
    return axiosInstance.post('/api/v1/task/', task)
    .then(res => {
        console.log(res);
        setReloadData(!reloadData);
        setTask({
            'name': '',
            'description': ''
        })
        return res;
    })
    .catch(err => {
        console.log(err);
    })
  }

  const handleAddAndCompleteTask = async () => {
    let addedTask = await handleAddTask();
    return axiosInstance.post(`/api/v1/review-session/${addedTask.data.id}/`)
    .then(res => {
        setReloadData(!reloadData);
        setTask({
            'name': '',
            'description': ''
        })
        setReviewTaskId(res.data.task);
        setReviewSessionId(res.data.id);
        setOpenReviewModal(true);
        handleClose();
    }).catch(err => {
        console.log(err);
    })
  }

  return (
    <Modal open={openAddModal} onClose={handleClose} >
        <Modal.Header>
            <h3>Add task</h3>
        </Modal.Header>
        <Modal.Body>
            <Form fluid>
                <Form.Group>
                    <Form.ControlLabel>Name</Form.ControlLabel>
                    <Form.Control name="name" autoComplete="off" value={task.name} onChange={(e)=>setTask({...task, ['name']: e})}/>
                    <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Description</Form.ControlLabel>
                    <Input as="textarea" rows={5} value={task.description} onChange={(e)=>setTask({...task, ['description']: e})}/>
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button color="blue" appearance="primary" onClick={handleAddTask}>Add</Button>
                        <Button color="cyan" appearance="primary" onClick={handleAddAndCompleteTask}>Add and Complete</Button>
                        <Button color="red" appearance="primary" onClick={handleClose}>Cancel</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </Modal.Body>
    </Modal>
  )
}