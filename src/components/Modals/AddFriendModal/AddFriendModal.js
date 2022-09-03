import React, {useState} from 'react'
import { 
    Modal,
    Form,
    ButtonToolbar,
    Button,
    Input,
    InputGroup,
    Animation,
    Placeholder
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import Checkmark from '../../../svg/Checkmark';
import axiosInstance from '../../../utils/axiosAPI';

export default function AddFriendModal({openAddFriendModal, setOpenAddFriendModal, reloadData, setReloadData, users}) {
  const [requestValue, setRequestValue] = useState()
  const [sentRequest, setSentRequest] = useState(false);

  const handleClose = () => {
    setOpenAddFriendModal(false);
    setSentRequest(false);
  }

  const handleSendFriendRequest = () =>{
    let requestUser = users.filter((user)=>user.username == requestValue);
    if (!requestUser){
        return;
    }
    axiosInstance.post('/api/v1/friend/request/', {
        'to_user': requestUser[0].id
    })
    .then(res => {
        console.log(res);
        setSentRequest(true);
        setRequestValue('');
        setReloadData(!reloadData);
    })
    .catch(err =>{
        console.log(err);
        setRequestValue('');
    })
  }
  return (
    <Modal open={openAddFriendModal} onClose={handleClose}>
        <Modal.Header>
            <h3>Add friend</h3>
        </Modal.Header>
        <Modal.Body>
            {!sentRequest && openAddFriendModal ? <Form fluid>
                <Form.Group>
                    <InputGroup style={{
                        width: '100%'
                    }}> 
                        <Input placeholder={'Username'} value={requestValue} onChange={(e)=>setRequestValue(e)}/>
                        <InputGroup.Addon>
                            <SearchIcon/>
                        </InputGroup.Addon>
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                <ButtonToolbar>
                        <Button color="blue" appearance="primary" onClick={handleSendFriendRequest}>Send request</Button>
                        <Button color="red" appearance="primary" onClick={handleClose}>Cancel</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form> : 
            <div>
                {sentRequest ? <Animation.Bounce in={sentRequest} timeout={3000}>
                    <div className="updated-container">
                        <h4>Sent friend request!</h4>
                        <Checkmark/>
                        <ButtonToolbar className="updated-button">
                            <Button color="blue" appearance='primary' onClick={()=>setSentRequest(false)}>Send another</Button>
                            <Button color="red" appearance="primary" onClick={handleClose}>Close</Button>
                        </ButtonToolbar>
                    </div>
                </Animation.Bounce> : <Placeholder.Graph/>}
            </div>}
        </Modal.Body>
    </Modal>
  )
}
