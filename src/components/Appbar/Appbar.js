import { Navbar, Nav, Button } from 'rsuite';
import { BiTask } from 'react-icons/bi';
import { IoMdSettings, IoMdMoon } from 'react-icons/io';
import { MdLightbulb } from 'react-icons/md';
import './Appbar.css';

export default function Appbar({theme, setTheme}){
    const handleThemeChange = (theme) => {
        setTheme(theme);
        localStorage.setItem('theme', theme);
    }

    return <>
        <Navbar appearance='subtle'>
            <Navbar.Brand href="#" className="logo-container">
                <BiTask className="logo-icon"/>
                <span className="logo-text">Retask</span>
            </Navbar.Brand>
            <Nav pullRight>
                {theme === 'light' ? 
                    <Nav.Item icon={<IoMdMoon/>} onClick={()=>handleThemeChange('dark')}>Dark</Nav.Item>
                :
                    <Nav.Item icon={<MdLightbulb/>} onClick={()=>handleThemeChange('light')}>Light</Nav.Item>}
                <Nav.Item icon={<IoMdSettings />}>Settings</Nav.Item>
                <Nav.Item>
                    <Button appearance="primary" className="navbar-login-button">Login</Button>
                </Nav.Item>
            </Nav>
        </Navbar>
    </>
}
