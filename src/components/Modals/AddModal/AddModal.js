import React, {useState} from 'react'
import { 
    Modal,
    Form,
    ButtonToolbar,
    Button,
    Input,
    Animation,
    Placeholder
} from 'rsuite';
import Checkmark from '../../../svg/Checkmark';
import axiosInstance from '../../../utils/axiosAPI';

export default function AddModal({openAddModal, setOpenAddModal, reloadData, setReloadData, setOpenReviewModal, setReviewTaskId, setReviewSessionId, setShowSpinner}) {
  const [task, setTask] = useState({
    'name': '',
    'description': ''
  })
  const [added, setAdded] = useState(false);

  const handleClose = () => {
    setOpenAddModal(false);
    setTask({
        'name': '',
        'description': ''
    })
    setAdded(false);
  }

  const handleAddTask = async (review) => {
    setShowSpinner(true);
    return axiosInstance.post('/api/v1/task/', task)
    .then(res => {
        console.log(res);
        setReloadData(!reloadData);
        setTask({
            'name': '',
            'description': ''
        })
        if (!review){
            setAdded(true);
        }
        return res;
    })
    .catch(err => {
        console.log(err);
    })
  }

  const handleAddAndCompleteTask = async () => {
    let addedTask = await handleAddTask(true);
    setShowSpinner(true);
    return axiosInstance.post(`/api/v1/review-session/${addedTask.data.id}/`)
    .then(res => {
        setTask({
            'name': '',
            'description': ''
        })
        setReviewTaskId(res.data.task);
        setReviewSessionId(res.data.id);
        setOpenReviewModal(true);
        setReloadData(!reloadData);
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
            {!added && openAddModal ? <Form fluid>
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
                        <Button color="blue" appearance="primary" onClick={()=>handleAddTask(false)}>Add</Button>
                        <Button color="cyan" appearance="primary" onClick={handleAddAndCompleteTask}>Add and Complete</Button>
                        <Button color="red" appearance="primary" onClick={handleClose}>Cancel</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form> : 
            <div>
                {added ? <Animation.Bounce in={added} timeout={3000}>
                    <div className="updated-container">
                        <h4>Added task!</h4>
                        <Checkmark/>
                        <ButtonToolbar className="updated-button">
                            <Button color="blue" appearance='primary' onClick={()=>setAdded(false)}>Add another</Button>
                            <Button color="red" appearance="primary" onClick={handleClose}>Close</Button>
                        </ButtonToolbar>
                    </div>
                </Animation.Bounce> :
                <Placeholder.Graph/>}
            </div>}
        </Modal.Body>
    </Modal>
  )
}
