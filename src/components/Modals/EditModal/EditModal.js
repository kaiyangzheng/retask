import React, {useState, useEffect} from 'react'
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
import './EditModal.css';

export default function EditModal({openEditModal, setOpenEditModal, reloadData, setReloadData, editTaskId, tasks}){
  let selectedTask = tasks.filter(task=>task.id==editTaskId)[0];

  const [task, setTask] = useState({
    'name': '',
    'description': ''
  })
  const [updated, setUpdated] = useState(false);

  const handleClose = () => {
    setOpenEditModal(false);
    setUpdated(false);
  }

  const handleUpdateTask = async () => {
    return axiosInstance.put(`/api/v1/task/${editTaskId}/`, task)
    .then(res => {
        console.log(res);
        setReloadData(!reloadData);
        setUpdated(true);
    })
    .catch(err => {
        console.log(err);
    })
  }

  useEffect(() => { 
    if (selectedTask){
        setTask({
            'name': selectedTask.name,
            'description': selectedTask.description 
        })
    }
  }, [selectedTask])

  if (!selectedTask){
    return null;
  }

  return (
    <Modal open={openEditModal} onClose={handleClose}>
        <Modal.Header>
            <h3>Edit task</h3>
        </Modal.Header>
        <Modal.Body>
            {!updated && openEditModal ? <Form fluid>
                <Form.Group>
                    <Form.ControlLabel>Name</Form.ControlLabel>
                    <Form.Control name="name" autoComplete="off" value={task.name} onChange={(e)=>setTask({...task, ['name']: e})}/>
                </Form.Group>
                <Form.Group>
                    <Form.ControlLabel>Description</Form.ControlLabel>
                    <Input as="textarea" rows={5} value={task.description} onChange={(e)=>setTask({...task, ['description']: e})}/>
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button color="blue" appearance="primary" onClick={handleUpdateTask}>Update</Button>
                        <Button color="red" appearance="primary" onClick={handleClose}>Cancel</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form> :
            <div>
                {updated ? <Animation.Bounce in={updated} timeout={3000}>
                    <div className="updated-container">
                        <h4>Updated task!</h4>
                        <Checkmark/>
                        <Button color="red" appearance="primary" onClick={handleClose} className="updated-button">Close</Button>
                    </div>
                </Animation.Bounce> :
                <Placeholder.Graph/>}
            </div>}
        </Modal.Body>
    </Modal>
  )
}
