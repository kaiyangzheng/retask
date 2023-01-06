import React, {useState, useEffect} from 'react' 
import {
    Modal, 
    Form,
    ButtonToolbar, 
    Button,
    InputPicker,
    Panel,
    IconButton,
    Placeholder
} from 'rsuite'
import axiosInstance from '../../../utils/axiosAPI';
import { convertUtcToLocal, secondsToHms } from '../../../utils/dateHelpers';
import PauseIcon from '@rsuite/icons/legacy/Pause';
import PlayIcon from '@rsuite/icons/legacy/Play';
import './ReviewModal.css';

export default function ReviewModal({openReviewModal, setOpenReviewModal, reloadData, setReloadData, reviewTaskId, reviewSessionId, tasks, setShowSpinner}) {
  const [quality, setQuality] = useState(0);
  const [stopwatch, setStopwatch] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finishedRes, setFinishedRes] = useState({})
  const [finishedReview, setFinishedReview] = useState(false);
  const qualityFormData = [
    {'label': '0 - complete blackout', 'value': 0},
    {'label': '1 - incorrect response; the correct one remembered', 'value': 1},
    {'label': '2 - incorrect response; where the correct one seemed easy to recall', 'value': 2},
    {'label': '3 - correct response recalled with serious difficulty', 'value': 3},
    {'label': '4 - correct response after hesitation', 'value': 4},
    {'label': '5 - perfect response', 'value': 5}
  ]
  let selectedTask = tasks.filter(task=>task.id==reviewTaskId)[0];

  const handleClose = () => {
    setOpenReviewModal(false);
    setFinishedReview(false);
    setQuality(0);
    setStopwatch(0);
    if (finishedReview){
        return;
    }
    axiosInstance.delete(`/api/v1/review-session/${reviewTaskId}/${reviewSessionId}/`)
    .then(res => {
        console.log(res);
        setReloadData(!reloadData);
    })
    .catch(err => {
        console.log(err);
    })
  }

  const handleCompleteReview = async () => {
    setShowSpinner(true);
    return axiosInstance.put(`/api/v1/review-session/${reviewTaskId}/${reviewSessionId}/`, {
        'quality': quality 
    })
    .then(res => {
        console.log(res);
        setReloadData(!reloadData);
        setFinishedRes(res.data);
        setFinishedReview(true);
    })
    .catch(err => {
        console.log(err);
    })
  }

  useEffect(()=>{
    setStopwatch(0);
  }, [openReviewModal])

  useEffect(()=>{
    let interval = null;
    if (openReviewModal && !paused){
        interval = setInterval(()=>{
            setStopwatch((stopwatch)=>stopwatch+1);
        }, 1000)
    } else {
        clearInterval(interval)
    }
    return () => {
        clearInterval(interval);
    }
  }, [reviewTaskId, paused])

  if (!selectedTask){
    return null;
  }

  return (
    <Modal open={openReviewModal} onClose={handleClose}>
        <Modal.Header>
            <h3>Review {selectedTask.name}</h3>
        </Modal.Header>
        {!finishedReview && openReviewModal ? <Modal.Body>
            <div className="description-container">
                <strong>Description</strong>
                <p>{selectedTask.description.length > 0 ? selectedTask.description : 'None'}</p>
            </div>
            <div className="instructions-container">
                <strong>Instructions</strong>
                <p>Complete the task described above. Then, input how well you did in the form below. Keep in mind that you <strong>DO NOT</strong> need to complete the task successfully; just try your best.</p>
            </div>
            <Form fluid className="review-form-container">
                <Form.Group>
                    <Form.ControlLabel><strong>Quality</strong></Form.ControlLabel>
                    <InputPicker data={qualityFormData} style={{
                        width: '100%'
                    }} value={quality} onChange={(e)=>setQuality(e)} cleanable={false}/>
                    <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group>
                    <div className="review-modal-footer">
                        <ButtonToolbar>
                            <Button color="blue" appearance="primary" onClick={handleCompleteReview}>Submit</Button>
                            <Button color="red" appearance="primary" onClick={handleClose}>Cancel</Button>
                        </ButtonToolbar>
                        <div className="review-modal-timer-container">
                            <div className="pause-play-btn">
                                {!paused ? <IconButton icon={<PauseIcon />} placement="left" onClick={()=>setPaused(true)}/> :
                                <IconButton icon={<PlayIcon/>} placement="left" onClick={()=>setPaused(false)}/> }
                            </div>
                            <Panel bordered className="review-modal-timer" defaultExpanded={false}>
                                {secondsToHms(stopwatch)}
                            </Panel>
                        </div>
                    </div>
                </Form.Group>
            </Form>
        </Modal.Body> : 
        <Modal.Body>
            {finishedReview ? <div>
                <div className="next-review-date-container">
                    <h4>Next review date: {convertUtcToLocal(selectedTask.next_review_date)} ({selectedTask.interval} days)</h4>
                </div>
                <div className="review-task-stats">
                    <span>Time elapsed: {secondsToHms(finishedRes.time_elapsed)} </span>
                    <span>New quality: {finishedRes.quality}</span>
                </div>
                <div className="review-modal-footer-btn-container">
                    <Button color="red" appearance="primary" onClick={handleClose}>Close</Button>
                </div>
            </div> : 
            <Placeholder.Graph/>}
        </Modal.Body>}
    </Modal>
  )
}