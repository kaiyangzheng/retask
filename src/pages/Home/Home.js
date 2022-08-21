import React from 'react'
import Greeting from '../../components/Greeting/Greeting';
import Modifygroup from '../../components/ModifyGroup/ModifyGroup';
import './Home.css';

export default function Home({ loginInfo }) {
  return (
    <div className="home-top-container">
        <Greeting loginInfo={loginInfo} />
        <Modifygroup />
    </div>
  )
}
