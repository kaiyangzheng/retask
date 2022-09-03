import React, {useState} from 'react' 
import { 
    Modal,
    Form,
    List,
    IconButton,
    Placeholder
} from 'rsuite';
import { stringToColor} from './../../../utils/colorHelpers';
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';
import axiosInstance from '../../../utils/axiosAPI';
import './FriendRequestModal.css';

export default function FriendRequestModal({openFriendRequestsModal, setOpenFriendRequestsModal, friendRequests, reloadData, setReloadData, personalInfo, users, dataLoaded}){
    const handleClose = () => {
        setOpenFriendRequestsModal(false);
    }

    const handleAcceptRequest = (requestId) => {
        axiosInstance.put('/api/v1/friend/request/', {
            'request_id': requestId,
            'accept': true
        })
        .then(res => {
            console.log(res);
            setReloadData(!reloadData);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleRejectRequest = (requestId) => {
        axiosInstance.put('/api/v1/friend/request/', {
            'request_id': requestId,
            'accept': false 
        })
        .then(res => {
            console.log(res);
            setReloadData(!reloadData);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const [requestType, setRequestType] = useState('received')
    let receivedRequests = friendRequests.filter((request)=>request.to_user == personalInfo.id);
    let sentRequests = friendRequests.filter((request)=>request.from_user == personalInfo.id);
    return <>
        <Modal open={openFriendRequestsModal} onClose={handleClose}>
            <Modal.Header>
                <h3>Friend requests</h3>
            </Modal.Header>
            <Modal.Body>
                <Form fluid>
                    <Form.Group>
                        <div className="friend-request-title">
                            <div className={requestType == 'received' ? 'selected received' : 'received'} onClick={()=>setRequestType('received')}>
                                Received
                            </div>
                            <div className={requestType == 'sent' ? "selected sent" : "sent"} onClick={()=>setRequestType('sent')}>
                                Sent
                            </div>
                        </div>
                        <div>
                            {dataLoaded ? <div  className="friend-request-content">
                                {requestType == 'received' ? <List bordered className="friend-request-list">
                                    {receivedRequests.map((request)=>{
                                        let user = users.filter((user)=>user.id == request.from_user)[0];
                                        if (!user){
                                            return null;
                                        }
                                        return <List.Item className="friend-request-item">
                                            <div className="user-pill" style={{
                                                backgroundColor: stringToColor(user.username)
                                            }}>
                                                {user.username}
                                            </div>
                                            <div className="friend-request-action-buttons">
                                                <IconButton icon={<CheckIcon/>} appearance="primary" onClick={()=>handleAcceptRequest(request.id)}/>
                                                <IconButton icon={<CloseIcon/>} appearance="primary" color="red" onClick={()=>handleRejectRequest(request.id)}/>
                                            </div>
                                        </List.Item>
                                    })}
                                    {receivedRequests.length == 0 && <span style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '5px'
                                    }}>No data</span>}
                                </List> : 
                                <List bordered className="friend-request-list">
                                    {sentRequests.map((request)=>{
                                        let user = users.filter((user)=>user.id == request.to_user)[0];
                                        return <List.Item className="friend-request-item">
                                            <div className="user-pill friend-request-profile" style={{
                                                backgroundColor: stringToColor(user.username)
                                            }}>
                                                {user.username}
                                            </div>

                                        </List.Item>
                                    })}
                                    {sentRequests.length == 0 && <span style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '5px'
                                    }}>No data</span>}
                                </List>}
                            </div> : <Placeholder.Graph/>}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    </>
}