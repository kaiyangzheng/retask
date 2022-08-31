import React from 'react'
import {
    Panel,
    Placeholder
} from 'rsuite';
import './GoalProgress.css';

export default function GoalProgress({taskStats, goals, dataLoaded}) {
  return <>
  <Panel className="goal-process" bordered>
    <h2>Task report</h2>
    <div className="goal-process-container">
        <Panel className="goal-process-item">
            {dataLoaded ? <div className="goal-process-content">
                <div className="goal-process-stats">
                    <span className="user-value">{taskStats.basic_info.total_tasks_added}</span>
                    <span className="left-slash">/</span>
                    <span className="goal-value">{goals.total_added}</span>
                    <span className="description">&nbsp;goal</span>
                </div>
                <div className="goal-process-percentage">
                    ({Math.round((taskStats.basic_info.total_tasks_added/goals.total_added)*100*10)/10}%)
                </div>
                <div className="goal-name">
                    Tasks added
                </div>
            </div> : <Placeholder.Graph height={100}/>}
        </Panel>
        <Panel className="goal-process-item border-top-768 mt-20-768">
            {dataLoaded ? <div className="goal-process-content">
                <div className="goal-process-stats">
                    <span className="user-value">{Math.round(taskStats.stats.average_quality*10)/10}</span>
                    <span className="left-slash">/</span>
                    <span className="goal-value">{goals.average_quality}</span>
                    <span className="description">&nbsp;goal</span>
                </div>
                <div className="goal-process-percentage">
                    ({Math.round((taskStats.stats.average_quality/goals.average_quality)*100*10)/10}%)
                </div>
                <div className="goal-name">
                    Average quality
                </div>
            </div> : <Placeholder.Graph height={100}/>}
        </Panel>
    </div>
    <div className="goal-process-container mt-20">
        <Panel className="goal-process-item border-top">
            {dataLoaded ? <div className="goal-process-content">
                <div className="goal-process-stats">
                    <span className="user-value">{Math.round(taskStats.stats.average_repetitions*10)/10}</span>
                    <span className="left-slash">/</span>
                    <span className="goal-value">{goals.average_repetitions}</span>
                    <span className="description">&nbsp;goal</span>
                </div>
                <div className="goal-process-percentage">
                    ({Math.round((taskStats.stats.average_repetitions/goals.average_repetitions)*100*10)/10}%)
                </div>
                <div className="goal-name">
                    Average repetitions
                </div>
            </div> : <Placeholder.Graph height={100}/>}
        </Panel>
        <Panel className="goal-process-item border-top mt-20-768">
            {dataLoaded ? <div className="goal-process-content">
                <div className="goal-process-stats">
                    <span className="user-value">{Math.round(taskStats.stats.average_time_spent*10)/10}</span>
                    <span className="left-slash">/</span>
                    <span className="goal-value">{goals.average_time_spent}</span>
                    <span className="description">s&nbsp;limit</span>
                </div>
                <div className="goal-processs-percentage">
                ({Math.round((taskStats.stats.average_time_spent/goals.average_time_spent)*100*10)/10}%)
                </div>
                <div className="goal-name">
                    Average time spent
                </div>  
            </div> : <Placeholder.Graph height={100}/>}
        </Panel>
    </div>
    </Panel>
  </>
}
