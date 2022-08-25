import React, {useEffect} from 'react'
import {
    useNavigate
} from 'react-router-dom';
import './Landing.css';

export default function Landing({loginInfo}) {
  const navigate = useNavigate();
  // delete when landing page is done
  useEffect(()=>{
    if (localStorage.getItem('isLoggedIn')){
        navigate('/home');
    }else{
        navigate('/login');
    }
  }, [])

  return (
    <div className="landing-placeholder">
        <h2>Landing Page</h2>
    </div>
  )
}
