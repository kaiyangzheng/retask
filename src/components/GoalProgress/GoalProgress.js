import React from 'react'
import {
    Panel,
    Placeholder,
    Progress
} from 'rsuite';
import './GoalProgress.css';

export default function GoalProgress({taskStats, goals, dataLoaded}) {
  let totalTasksAdded = 0;
  let averageQuality = 0;
  let averageRepetitions = 0;
  let averageTimeSpent = 0;

  let totalTasksAddedRatio = 0;
  let averageQualityRatio = 0;
  let averageRepetitionsRatio = 0;
  let averageTimeSpentRatio = 0;

  console.log(taskStats);
  if(!taskStats.message && dataLoaded){
    totalTasksAdded = taskStats.basic_info.total_tasks_added;
    averageQuality = taskStats.stats.average_quality;
    averageRepetitions = taskStats.stats.average_repetitions;
    averageTimeSpent = taskStats.stats.average_time_spent;
    totalTasksAddedRatio = totalTasksAdded/goals.total_added;
    averageQualityRatio = averageQuality/goals.average_quality;
    averageRepetitionsRatio = averageRepetitions/goals.average_repetitions;
    averageTimeSpentRatio = averageTimeSpent/goals.average_time_spent;
  }
  return <>
  <Panel className="goal-process" bordered>
    <h2>Task report</h2>
    <div className="goal-process-container">
        <Panel className="goal-process-item">
            {dataLoaded ? <div className="goal-process-content">
                <div className="goal-process-stats">
                    <span className="user-value">{totalTasksAdded}</span>
                    <span className="left-slash">/</span>
                    <span className="goal-value">{goals.total_added}</span>
                    <span className="description">&nbsp;goal</span>
                </div>
                {/* <div className="goal-process-percentage">
                    ({Math.round((totalTasksAdded/goals.total_added)*100*10)/10}%)
                </div> */}
                <div className="goal-name">
                    Tasks added
                </div>
                <Progress.Line percent={Math.round((totalTasksAddedRatio)*100*10)/10} strokeColor={totalTasksAddedRatio < 1 && "#ffc107"} status={totalTasksAddedRatio < 1 ? 'active' : 'success'} className="goal-process-bar"/>
            </div> : <Placeholder.Graph height={100}/>}
        </Panel>
        <Panel className="goal-process-item border-top-768 mt-20-768">
            {dataLoaded ? <div className="goal-process-content">
                <div className="goal-process-stats">
                    <span className="user-value">{Math.round(averageQuality*10)/10}</span>
                    <span className="left-slash">/</span>
                    <span className="goal-value">{goals.average_quality}</span>
                    <span className="description">&nbsp;goal</span>
                </div>
                <div className="goal-name">
                    Average quality
                </div>
                <Progress.Line percent={Math.round((averageQualityRatio)*100*10)/10} strokeColor={averageQualityRatio < 1 && "#ffc107"} status={averageQualityRatio < 1 ? 'active' : 'success'} className="goal-process-bar"/>
            </div> : <Placeholder.Graph height={100}/>}
        </Panel>
    </div>
    <div className="goal-process-container mt-20">
        <Panel className="goal-process-item border-top">
            {dataLoaded ? <div className="goal-process-content">
                <div className="goal-process-stats">
                    <span className="user-value">{Math.round(averageRepetitions*10)/10}</span>
                    <span className="left-slash">/</span>
                    <span className="goal-value">{goals.average_repetitions}</span>
                    <span className="description">&nbsp;goal</span>
                </div>
                <div className="goal-name">
                    Average repetitions
                </div>
                <Progress.Line percent={Math.round(averageRepetitionsRatio*100*10)/10} strokeColor={averageRepetitionsRatio < 1 && "#ffc107"} status={averageRepetitionsRatio < 1 ? 'active' : 'success'} className="goal-process-bar"/>
            </div> : <Placeholder.Graph height={100}/>}
        </Panel>
        <Panel className="goal-process-item border-top mt-20-768">
            {dataLoaded ? <div className="goal-process-content">
                <div className="goal-process-stats">
                    <span className="user-value">{Math.round(averageTimeSpent*10)/10}</span>
                    <span className="left-slash">/</span>
                    <span className="goal-value">{goals.average_time_spent}</span>
                    <span className="description">s&nbsp;limit</span>
                </div>
                <div className="goal-name">
                    Average time spent
                </div>  
                <Progress.Line percent={Math.round(averageTimeSpentRatio*100*10)/10} strokeColor={averageRepetitionsRatio >= 1 && "#ffc107"} status={averageTimeSpentRatio >= 1 ? 'active' : 'success'} className="goal-process-bar"/>
            </div> : <Placeholder.Graph height={100}/>}
        </Panel>
    </div>
    </Panel>
  </>
}
