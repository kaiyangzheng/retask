import React, {useState, useEffect} from 'react';
import {
    useLocation
} from 'react-router-dom';
import BreadcrumbHeader from '../../components/Breadcrumb/BreadcrumbHeader';
import ProgressLineChart from '../../components/ProgressLineChart/ProgressLineChart';
import GoalProgress from '../../components/GoalProgress/GoalProgress';
import './Dashboard.css';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

export default function Dashboard({tasks, reviewSessions, taskStats, goals, dataLoaded, theme}){
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
        document.title = 'Retask | Dashboard';
    }, [])

    return <>
        <div className="dashboard-container" style={{
            width: windowDimensions.width <= 768 && '100vw'
        }}>
            <div className="dashboard-breadcrumb-container">
                <BreadcrumbHeader location={location}/>
            </div>
            <div className="dashboard-goal-progress-container">
                <GoalProgress taskStats={taskStats} goals={goals} dataLoaded={dataLoaded}/>
            </div>
            <div className="dashboard-progress-line-container mb-20-768">
                <ProgressLineChart reviewSessions={reviewSessions} tasks={tasks} dataLoaded={dataLoaded} theme={theme}/>
            </div>
        </div>
    </>
}