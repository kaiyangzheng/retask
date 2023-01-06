import React, {useState, useEffect} from 'react';
import {
    useLocation 
} from 'react-router-dom';
import {
    Panel,
    Placeholder,
    Button,
    ButtonToolbar
} from 'rsuite';
import BreadcrumbHeader from '../../components/Breadcrumb/BreadcrumbHeader';
import PlusIcon from '@rsuite/icons/Plus'; 
import SentToUserIcon from '@rsuite/icons/SentToUser';
import './Friends.css';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

export default function Friends({users, personalInfo, dataLoaded, setOpenAddFriendModal, setOpenFriendRequestsModal}) {
  const location = useLocation();
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(()=>{
    document.title = "Retask | Friends";
  }, [])
  return (
    <div className="friends-container" style={{
        width: windowDimensions.width <= 768 && '100vw'
    }}>
        <div className="friends-breadcrumb-container">
            <BreadcrumbHeader location={location}/>
        </div>
        <div className="friends-content">
            <div className="friends-list-container">
                <div className="friends-title">
                    <h2>Friends</h2>
                </div>
                <div className="friends-button">
                    <Button appearance="primary" color="blue" onClick={()=>setOpenAddFriendModal(true)}>
                        <PlusIcon/> Add Friend
                    </Button>
                    <Button appearance="primary" color="red" onClick={()=>setOpenFriendRequestsModal(true)}>
                        <SentToUserIcon/> Friend Requests
                    </Button>
                </div>
                <div >
                    {dataLoaded ? <div className="friends-list">
                        {personalInfo.friends.map((friend)=>{
                            return <Panel header={users.filter((user)=>user.id == friend)[0].username} collapsible bordered>
                                
                            </Panel>    
                        })}
                        {personalInfo.friends.length == 0 &&
                            <p>No data</p>
                        }
                    </div> : <Placeholder.Graph style={{
                        marginTop: '20px'
                    }}/>}
                </div>
            </div>
        </div>
    </div>
  )
}
