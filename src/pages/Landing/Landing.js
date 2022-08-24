import React, {useEffect} from 'react'
import {
    useNavigate
} from 'react-router-dom';

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
    <div>

    </div>
  )
}
