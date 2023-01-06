import React, {useState} from 'react'
import { 
  Panel, 
  Button, 
  Input, 
  InputGroup,
  Whisper, 
  Tooltip
 } from 'rsuite'
import { BiTask } from 'react-icons/bi'
import GoogleIcon from '../../components/GoogleIcon/GoogleIcon';
import HrTextMiddle from '../../components/HrTextMiddle/HrTextMiddle';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import {
  Link,
  useNavigate
} from 'react-router-dom';
import './../Login/Login.css';
import axios from 'axios';
import axiosInstance from '../../utils/axiosAPI';

export default function Register({ setLoginInfo, setShowSpinner }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [user, setUser] = useState({
    'username': '',
    'password': '',
    'confirmPassword': '',
    'email': ''
  })
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      return;
    }
    setShowSpinner(true);
    axios.post('https://retask-api.herokuapp.com/api/v1/user/create/', user)
    .then(res => {
      axiosInstance.post('/api/v1/token/obtain/', user)
      .then(res => {
        axiosInstance.defaults.headers['Authorization'] = 'JWT ' + res.data.access
        localStorage.setItem('access_token', res.data.access)
        localStorage.setItem('refresh_token', res.data.refresh)
        localStorage.setItem('isLoggedIn', true)
        localStorage.setItem('username', user.username)
        setLoginInfo({
          isLoggedIn: true,
          username: user.username,
          access: res.data.access,
          refresh: res.data.refresh
        });
        navigate('/home')
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  document.title = 'Retask | Register';
  return (
      <Panel bordered className="login-container">
        <div className="login-logo-container">
          <BiTask className="login-logo-icon" />
          <span className="login-logo-text">Retask</span>
        </div>
        <div className="login-intro">
          Welcome! Register
        </div>
        <div className="login-form-container">
          <form className="login-form">
            <Whisper trigger="focus" speaker={<Tooltip>Required</Tooltip>}>
              <Input placeholder="Username" style={{
                marginTop: '40px',
                height: '40px',
                width: '100%',
              }} value={user.username} onChange={(e)=>setUser({...user, username: e})}/>
            </Whisper>
            <Whisper trigger="focus" speaker={<Tooltip>Required</Tooltip>}>
              <Input placeholder="Email" style={{
                marginTop: '20px',
                height: '40px',
                width: '100%',
              }} value={user.email} onChange={(e)=>setUser({...user, email: e})}/>
            </Whisper>
            <Whisper trigger="focus" speaker={<Tooltip>Required</Tooltip>}>
              <InputGroup inside style={{
                marginTop: '20px',
                height: '40px',
                width: '100%',
              }}>
                <Input placeholder="Password" type={passwordVisible ? 'text' : 'password'} value={user.password} onChange={(e)=>setUser({...user, password: e})}/>
                <InputGroup.Button onClick={()=>setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ?  <EyeIcon/> : <EyeSlashIcon/>}
                </InputGroup.Button>
              </InputGroup>
            </Whisper>
            <Whisper trigger="focus" speaker={<Tooltip>Required</Tooltip>}>
              <InputGroup inside style={{
                marginTop: '20px',
                height: '40px',
                width: '100%',
              }}>
                <Input placeholder="Confirm Password" type={passwordVisible ? 'text' : 'password'} value={user.confirmPassword} onChange={(e)=>setUser({...user, confirmPassword: e})}/>
                <InputGroup.Button onClick={()=>setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ?  <EyeIcon/> : <EyeSlashIcon/>}
                </InputGroup.Button>
              </InputGroup>
            </Whisper>
            <Button appearance="primary" className="login-form-button" style={{
              marginTop: '20px',
              width: '100%',
            }} onClick={handleRegister}>
              Register
            </Button>
          </form>
          <div className="register-container">
            <span>Already have an account?</span>
            <Link to="/login">
              <Button appearance="link" className="register-button">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </Panel>
  )
}
