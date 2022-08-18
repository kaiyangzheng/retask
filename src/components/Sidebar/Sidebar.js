import React, {useState} from 'react';
import { Sidenav, Nav, Toggle } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import CalendarIcon from '@rsuite/icons/Calendar';
import HomeIcon from '@rsuite/icons/legacy/Home';
import PeoplesIcon from '@rsuite/icons/Peoples';
import MessageIcon from '@rsuite/icons/Message';
import BranchIcon from '@rsuite/icons/Branch';
import GearIcon from '@rsuite/icons/Gear';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import ExitIcon from '@rsuite/icons/Exit';

export default function Sidebar({ children }){
    const [expanded, setExpanded] = useState(false);
    return <>
        <div style={{
            display: 'flex',
        }}>
            <div style={{
                width: 240,
            }}>
                <Sidenav expanded={expanded} appearance="subtle" style={{
                    color: '#fff',
                }}>
                    <Sidenav.Toggle expanded={expanded} onToggle={expanded => setExpanded(expanded)} />
                    <Sidenav.Body>
                        <Nav>
                            <Nav.Item eventKey="home" icon={<HomeIcon/>}>
                                Home
                            </Nav.Item>
                            <Nav.Item eventKey="dashboard" icon={<DashboardIcon />}>
                                Dashboard
                            </Nav.Item>
                            <Nav.Item eventKey="calendar" icon={<CalendarIcon />}>    
                                Calendar 
                            </Nav.Item>
                            <hr />
                            <Nav.Item eventKey="friends" icon={<PeoplesIcon />}>
                                Friends 
                            </Nav.Item>
                            <Nav.Item eventKey="chat" icon={<MessageIcon />}>
                                Chat 
                            </Nav.Item>
                            <Nav.Item eventKey="collaborations" icon={<BranchIcon />}>
                                Collaborations
                            </Nav.Item>
                            <hr />
                            <Nav.Item eventKey="settings" icon={<GearIcon />}>
                                Settings
                            </Nav.Item>
                            <Nav.Item eventKey="profile" icon={<UserInfoIcon/>}>
                                Account
                            </Nav.Item>
                            <Nav.Item eventKey="logout" icon={<ExitIcon />}>
                                Logout
                            </Nav.Item>
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>
            </div>
            <div style={{
                flex: 1,
            }}>
                {children}
            </div>
        </div>
    </>
}