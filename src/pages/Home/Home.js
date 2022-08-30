import React, { useState, useEffect } from 'react'
import Greeting from '../../components/Greeting/Greeting';
import Modifygroup from '../../components/ModifyGroup/ModifyGroup';
import TaskTable from '../../components/TaskTable/TaskTable';
import BreadcrumbHeader from '../../components/Breadcrumb/BreadcrumbHeader';
import {
  useLocation
} from 'react-router-dom';
import {
  Panel 
} from 'rsuite';
import './Home.css';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function Home({ loginInfo, currentTime, users, reviewSessions, tasks, taskTypes, dataLoaded, openAddModal, setOpenAddModal, reloadData, setReloadData, setReviewTaskId, setReviewSessionId, setOpenReviewModal, setEditTaskId, setOpenEditModal, setModifyType, setOpenModifyModal, setOpenGoalsModal, goals, setGoals, theme }) {
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
    document.title = "Retask | Home";
  }, [])

  return (
    <>
    <div className="home-container" style={{
      width: windowDimensions.width <= 768 && '100vw'
    }}>
      <div className="home-breadcrumb-container">
        <BreadcrumbHeader location={location}/>
      </div>
      <div className="home-intro-container">
        <Greeting loginInfo={loginInfo} />
        <Modifygroup loginInfo={loginInfo} setOpenAddModal={setOpenAddModal} setModifyType={setModifyType} setOpenModifyModal={setOpenModifyModal} setOpenGoalsModal={setOpenGoalsModal}/>
      </div>
      <div className="home-table-container">
        <TaskTable tasks={tasks} taskTypes={taskTypes} dataLoaded={dataLoaded} currentTime={currentTime} users={users} reloadData={reloadData} setReloadData={setReloadData} setReviewTaskId={setReviewTaskId} setReviewSessionId={setReviewSessionId} setOpenReviewModal={setOpenReviewModal} setEditTaskId={setEditTaskId} setOpenEditModal={setOpenEditModal}/>
      </div>
      <div className="home-more-info-container">
        <Panel bordered className="more-info-item">
          <h4>What is spaced repetition?</h4>
          <p>Spaced repetition is a studying technique that helps you retain information faster and better. It accomplishes this by spacing out your review sessions based on how well you understand the topic. This has two advantages: 1. You don't have to cram everything all at once, and 2. The memories in your brain become stronger through repeated practice.</p>
          <p>Source: <a target="_blank" href="https://e-student.org/spaced-repetition/">Spaced Repetition: A Guide to the Technique</a></p>
        </Panel>
        <Panel bordered className="more-info-item">
          <h4>Is it effective? How?</h4>
          <p>Spaced repetition is effective because it inherently exploits the strenghts and weaknesses of the human brain. Our brains are not strong at memorizing over 5-7 new pieces of information at a time, but they are acute in strengthening memories encountered frequently over time. In fact, studies have shown that spaced learning increaes information retention by 200%.</p>
          <p>Source: <a target="_blank" href="https://www.theguardian.com/education/2016/jan/23/spaced-repetition-a-hack-to-make-your-brain-store-information">Spaced repetition: a hack to make your brain store information</a></p> 
        </Panel>
        <Panel bordered className="more-info-item">
          <h4>SM2: A simple spaced repetition algorithm</h4>
          <p>Retask uses the SM2 spaced repetition algorithm, which takes in 4 inputs: quality, repetitions, previous ease factor, and previous interval, to compute the next date in which the user should review the task again. The algorithm returns 3 outputs: interval, repetitions, and ease factor, which are all inputted into the algorithm on its next call.</p>
          <p>Credits: <a href="https://github.com/thyagoluciano/sm2" target="_blank">Github - thyagoluciano</a></p>
        </Panel>
      </div>
    </div>
    </>
  )
}
