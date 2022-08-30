import React, {useState, useEffect} from 'react';
import {
    Modal,
    Form,
    ButtonToolbar,
    Button,
    InputNumber,
    Animation,
    Placeholder 
} from 'rsuite';
import Checkmark from '../../../svg/Checkmark';
import axiosInstance from '../../../utils/axiosAPI';

export default function GoalsModal({openGoalsModal, setOpenGoalsModal, reloadData, setReloadData, goals}){
    const [goalValues, setGoalValues] = useState({
        'total_added': null,
        'average_quality': null,
        'average_repetitions': null,
        'average_time_spent': null 
    })
    const [updated, setUpdated] = useState(false);

    const handleClose = () => {
        setOpenGoalsModal(false);
        setUpdated(false);
    }

    const handleSubmitGoal = () => {
        console.log(goalValues);
        axiosInstance.post('/api/v1/goal/', goalValues)
        .then(res => {
            setReloadData(!reloadData);
            setUpdated(true);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(()=>{
        if (goals){
            setGoalValues(goals);
        }
    }, [goals])

    if (!goals){
        return null;
    }

    return <>
        <Modal open={openGoalsModal} onClose={handleClose}>
            <Modal.Header>
                <h3>Goals</h3>
            </Modal.Header>
            <Modal.Body>
                {!updated && openGoalsModal ? <Form fluid>
                    <Form.Group>
                        <Form.ControlLabel>Total tasks added</Form.ControlLabel>
                        <InputNumber min={0} max={100} style={{
                            width: '100%'
                        }} value={goalValues.total_added} onChange={(e)=>setGoalValues({...goalValues, ['total_added']: parseInt(e)})}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Average quality</Form.ControlLabel>
                        <InputNumber min={0} max={5} style={{
                            width: '100%'
                        }} step={0.5} value={goalValues.average_quality} onChange={(e)=>setGoalValues({...goalValues, ['average_quality']: parseFloat(e)})}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Average repetitions</Form.ControlLabel>
                        <InputNumber min={0} max={20} style={{
                            width: '100%'
                        }} value={goalValues.average_repetitions}  step={0.5} onChange={(e)=>setGoalValues({...goalValues, ['average_repetitions']: parseFloat(e)})}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Average time spent</Form.ControlLabel>
                        <InputNumber min={0} style={{
                            width: '100%'
                        }} value={goalValues.average_time_spent} onChange={(e)=>setGoalValues({...goalValues, ['average_time_spent']: parseInt(e)})}/>
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button color="blue" appearance="primary" onClick={handleSubmitGoal}>Submit</Button>
                            <Button color="red" appearance="primary" onClick={handleClose}>Cancel</Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form> : <div>
                    {updated ? <Animation.Bounce in={updated} timeout={3000}>
                        <div className="updated-container">
                            <h4>Updated goals!</h4>
                            <Checkmark/>
                            <Button color="red" appearance="primary" onClick={handleClose} className="updated-button">Close</Button>
                        </div>
                    </Animation.Bounce>:
                    <Placeholder.Graph/>}
                </div>}
            </Modal.Body>
        </Modal>
    </>
}