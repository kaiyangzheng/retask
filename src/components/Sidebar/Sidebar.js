import React, {useState, useEffect} from 'react';
import { Sidenav, Nav, Toggle, Container } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import CalendarIcon from '@rsuite/icons/Calendar';
import HomeIcon from '@rsuite/icons/legacy/Home';
import PeoplesIcon from '@rsuite/icons/Peoples';
import MessageIcon from '@rsuite/icons/Message';
import BranchIcon from '@rsuite/icons/Branch';
import GearIcon from '@rsuite/icons/Gear';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import ExitIcon from '@rsuite/icons/Exit';
import {
    useNavigate,
    Link,
    useLocation,
} from 'react-router-dom';
import './Sidebar.css';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

export default function Sidebar({ children, navColor, loginInfo, setLoginInfo }){
    const [expanded, setExpanded] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [active, setActive] = useState('home');
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setLoginInfo({
            isLoggedIn: false,
            username: '',
            access: '',
            refresh: '',
        })
        navigate('/login');
    }

    useEffect(() => {
        function handleResize() {
          setWindowDimensions(getWindowDimensions());
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);


    return <>
        <div style={{
            display: 'flex',
        }}>
            {windowDimensions.width > 768 && <div style={{
                width: expanded ? 240 : 50,
            }}>
                <Sidenav expanded={expanded} appearance="subtle" style={{
                    display: loginInfo.isLoggedIn ? 'block' : 'none',
                }}>
                    {/* <Sidenav.Toggle expanded={expanded} onToggle={expanded => setExpanded(expanded)} style={{
                                color: navColor,    
                                }} /> */}
                    <Sidenav.Body>
                        <Nav activeKey={active}>
                            <Nav.Item eventKey="home" as={Link} to="/home" icon={<HomeIcon style={{
                                color: active!='home' && navColor,    
                                }}/>} style={{
                                    color: navColor,    
                                    }} onClick={()=>setActive('home')}>
                                Home
                            </Nav.Item>
                            <Nav.Item eventKey="dashboard" as={Link} to="/dashboard" icon={<DashboardIcon style={{
                                color: active!='dashboard' && navColor,    
                                }}/>} style={{
                                    color: navColor,    
                                    }} onClick={()=>setActive('dashboard')}>
                                Dashboard
                            </Nav.Item>
                            <Nav.Item eventKey="calendar" as={Link} to="/calendar" icon={<CalendarIcon style={{
                                color: active!='calendar' && navColor,    
                                }}/>} style={{
                                    color: navColor,    
                                    }} onClick={()=>setActive('calendar')}>    
                                Calendar 
                            </Nav.Item>
                            <hr />
                            <Nav.Item eventKey="friends" as={Link} to="/friends" icon={<PeoplesIcon style={{
                                color: active!='friends' && navColor,    
                                }}/>} style={{
                                    color: navColor,    
                                    }} onClick={()=>setActive('friends')}>
                                Friends 
                            </Nav.Item>
                            <Nav.Item eventKey="chat" as={Link} to="/chat" icon={<MessageIcon style={{
                                color: active!='chat' && navColor,    
                                }}/>} style={{
                                    color: navColor,    
                                    }} onClick={()=>setActive('chat')}>
                                Chat 
                            </Nav.Item>
                            <Nav.Item eventKey="collaborations" as={Link} to="/collaborations" icon={<BranchIcon style={{
                                color: active!='collaborations' && navColor,    
                                }}/>} style={{
                                    color: navColor,    
                                    }} onClick={()=>setActive('collaborations')}>
                                Collaborations
                            </Nav.Item>
                            <hr />
                            <Nav.Item eventKey="settings" as={Link} to="/settings" icon={<GearIcon style={{
                                color: active!='settings' && navColor,    
                                }}/>} style={{
                                    color: navColor,    
                                    }} onClick={()=>setActive('settings')}>
                                Settings
                            </Nav.Item>
                            <Nav.Item eventKey="profile" as={Link} to="/profile" icon={<UserInfoIcon style={{
                                color: active!='profile' && navColor,    
                                }}/>} style={{
                                    color: navColor,    
                                    }} onClick={()=>setActive('profile')}>
                                Account
                            </Nav.Item>
                            <Nav.Item eventKey="logout" icon={<ExitIcon style={{
                                color: navColor,    
                                }}/>} style={{
                                    color: navColor,    
                                    }} onClick={handleLogout}>
                                Logout
                            </Nav.Item>
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>
            </div>}
            {windowDimensions.width <= 768 && 
            <div className="bottom-nav-container">

            </div>}
            <div style={{
                flex: 1,
            }}>
                {children}
            </div>
        </div>
    </>
}