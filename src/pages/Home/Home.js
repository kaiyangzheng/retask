import React, { useEffect } from 'react'
import Greeting from '../../components/Greeting/Greeting';
import Modifygroup from '../../components/ModifyGroup/ModifyGroup';
import ProgressLineChart from '../../components/ProgressLineChart/ProgressLineChart';
import TaskTable from '../../components/TaskTable/TaskTable';
import BreadcrumbHeader from '../../components/Breadcrumb/BreadcrumbHeader';
import {
  useLocation
} from 'react-router-dom';
import './Home.css';

export default function Home({ loginInfo, currentTime, user, reviewSessions, tasks, taskTypes, dataLoaded, openAddModal, setOpenAddModal, reloadData, setReloadData, setReviewTaskId, setReviewSessionId, setOpenReviewModal, setEditTaskId, setOpenEditModal, setModifyType, setOpenModifyModal, theme }) {
  const location = useLocation();
  useEffect(()=>{
    document.title = "Retask | Home";
  }, [])
  
  return (
    <>
    <div className="home-container">
      <div className="home-breadcrumb-container">
        <BreadcrumbHeader location={location}/>
      </div>
      <div className="home-intro-container">
        <Greeting loginInfo={loginInfo} />
        <Modifygroup loginInfo={loginInfo} setOpenAddModal={setOpenAddModal} setModifyType={setModifyType} setOpenModifyModal={setOpenModifyModal}/>
      </div>
      <div className="home-chart-container">
        <ProgressLineChart reviewSessions={reviewSessions} dataLoaded={dataLoaded} tasks={tasks} theme={theme}/>
      </div>
      <div className="home-table-container">
        <TaskTable tasks={tasks} taskTypes={taskTypes} dataLoaded={dataLoaded} currentTime={currentTime} user={user} reloadData={reloadData} setReloadData={setReloadData} setReviewTaskId={setReviewTaskId} setReviewSessionId={setReviewSessionId} setOpenReviewModal={setOpenReviewModal} setEditTaskId={setEditTaskId} setOpenEditModal={setOpenEditModal}/>
      </div>
    </div>
    </>
  )
}
