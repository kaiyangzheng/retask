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
import './../Login/Login.css';

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
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
            <Button appearance="ghost" className="login-form-button">
              <span className="login-form-button-text"><GoogleIcon/> Continue with Google</span>
            </Button>
            <div className="login-form-divider">
              <HrTextMiddle text="or"/>
            </div>
            <Whisper trigger="focus" speaker={<Tooltip>Required</Tooltip>}>
              <Input placeholder="Username" style={{
                marginTop: '40px',
                height: '40px',
                width: '100%',
              }}/>
            </Whisper>
            <Whisper trigger="focus" speaker={<Tooltip>Required</Tooltip>}>
              <Input placeholder="Email" style={{
                marginTop: '20px',
                height: '40px',
                width: '100%',
              }}/>
            </Whisper>
            <Whisper trigger="focus" speaker={<Tooltip>Required</Tooltip>}>
              <InputGroup inside style={{
                marginTop: '20px',
                height: '40px',
                width: '100%',
              }}>
                <Input placeholder="Password" type={passwordVisible ? 'text' : 'password'}/>
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
                <Input placeholder="Confirm Password" type={passwordVisible ? 'text' : 'password'}/>
                <InputGroup.Button onClick={()=>setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ?  <EyeIcon/> : <EyeSlashIcon/>}
                </InputGroup.Button>
              </InputGroup>
            </Whisper>
            <Button appearance="primary" className="login-form-button" style={{
              marginTop: '20px',
              width: '100%',
            }}>
              Login 
            </Button>
          </form>
          <div className="register-container">
            <span>Don't have an account?</span>
            <Button appearance="link" className="register-button">
              Register
            </Button>
          </div>
        </div>
      </Panel>
  )
}
