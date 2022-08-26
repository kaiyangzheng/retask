import React, {useState, useEffect} from 'react';
import {
    Calendar,
    Badge,
    Whisper,
    Popover,
    Placeholder,
    Panel,
    PanelGroup,
} from 'rsuite';
import { convertUtcToLocal, secondsToHms, getDateDifference, dateDifferenceMessage } from '../../utils/dateHelpers';
import './Calendar.css';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function TaskCalendar({tasks, reviewSessions, dataLoaded, currentTime}) {
  const [selectedDate, setSelectedDate] = useState(convertUtcToLocal(new Date()));
  const [dateReviewSessions, setDateReviewSessions] = useState([]);
  const [dateTasks, setDateTasks] = useState([]);
  const [dateAddedTasks, setDateAddedTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [expandedReviews, setExpandedReviews] = useState({});
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(()=>{
    document.title = 'Retask | Calendar'
  }, [])

  useEffect(()=>{
    let dateReviewSessions = reviewSessions.filter((reviewSession)=>{
      return convertUtcToLocal(reviewSession.time_finished) == selectedDate;
    })
    let dateTasks = tasks.filter((task)=>{
      return convertUtcToLocal(task.next_review_date) == selectedDate;
    })

    let dateAddedTasks = tasks.filter((task)=>{
      return convertUtcToLocal(task.date_added) == selectedDate;
    })
    setDateReviewSessions(dateReviewSessions);
    setDateTasks(dateTasks);
    setDateAddedTasks(dateAddedTasks);
  }, [selectedDate])

  useEffect(()=>{
    if (tasks && reviewSessions){
      for (let i = 0; i < tasks.length; i++){
        expandedTasks[tasks[i].id] = false;
      }
      for (let i = 0; i < reviewSessions.length; i++){
        expandedReviews[reviewSessions[i].id] = false;
      }
    }
  }, [dataLoaded])

  const handleClickTask = (taskId, close) => {
    if (!close && !expandedTasks[taskId] == false){
      return;
    }
    setExpandedTasks({...expandedTasks, [taskId]: !expandedTasks[taskId]})
  }

  const handleClickReview = (reviewSessionId, close) => {
    if (!close && !expandedReviews[reviewSessionId] == false){
      return;
    }
    setExpandedReviews({...expandedReviews, [reviewSessionId]: !expandedReviews[reviewSessionId]})
  }

  function renderCell(date) {
    let dateReviewSessions = reviewSessions.filter((reviewSession)=>{
      return convertUtcToLocal(reviewSession.time_finished) == convertUtcToLocal(date);
    })
    let dateTasks = tasks.filter((task)=>{
      return convertUtcToLocal(task.next_review_date) == convertUtcToLocal(date);
    })

    let dateAddedTasks = tasks.filter((task)=>{
      return convertUtcToLocal(task.date_added) == convertUtcToLocal(date);
    })

    dateReviewSessions.map((dateReviewSession)=>{
      dateReviewSession.type = 'dateReviewSession';
    })

    dateTasks.map((dateTask)=>{
      dateTask.type = 'dateTask';
    })

    dateAddedTasks.map((dateAddedTask)=>{
      dateAddedTask.type = 'dateAddedTask';
    })


    const list = dateAddedTasks.concat(dateReviewSessions).concat(dateTasks);
    const displayList = list.filter((item, index) => index < 2);

    if (displayList.length){
      const moreCount = list.length - displayList.length;

      const moreItem = (
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                {list.map((task, index)=>{
                  return <>
                  <a href={task.type == 'dateReviewSession' ? `#review-${task.id}` : `#task-${task.id}`}>
                    <div onClick={task.type == 'dateReviewSession' ? ()=>handleClickReview(task.id, false) : ()=>handleClickTask(task.id, false)}>
                      {task.type == 'dateTask' &&
                        <p className="calendar-item"><strong>Todo - </strong> review {task.name}</p>}
                      {task.type == 'dateReviewSession' && 
                        <p className="calendar-item">Reviewed {tasks.filter((taski) => taski.id ===task.task)[0].name}</p>}
                      {task.type == 'dateAddedTask' && 
                        <p className="calendar-item">Added {task.name}</p>}
                    </div>
                  </a>
                  </>
                })}
              </Popover>
            }
          >
            <a>{moreCount} more</a>
          </Whisper>
      );

      return <div className="calender-list-container">
        <ul className="calendar-list">
          {displayList.map((task, index)=>{
            return <a href={task.type == 'dateReviewSession' ? `#review-${task.id}` : `#task-${task.id}`}>
              <li key={index} className="calendar-item" onClick={task.type == 'dateReviewSession' ? ()=>handleClickReview(task.id, false) : ()=>handleClickTask(task.id, false)}>
                    {task.type == 'dateReviewSession' && <>
                      <Badge className="calendar-badge review" />
                      <span className="calendar-item-content">{`Reviewed ${tasks.filter((taski) => taski.id ===task.task)[0].name}`}</span>
                    </>}
                    {task.type == 'dateAddedTask' && <>
                      <Badge className="calendar-badge add"/>
                      <span className="calendar-item-content">{`Added ${task.name}`}</span>
                    </>}
                    {task.type == 'dateTask' && <>
                      <Badge className="calendar-badge next-review"/>
                      <span className="calendar-item-content"><strong>Todo - </strong> <span>review {task.name}</span></span>
                    </>}
              </li>
            </a>
          })}
          {windowDimensions.width > 768 && moreCount ? moreItem : null}
        </ul>
      </div>
    }else{
      return null;
    }
  }
  return (
    <>
    <div className="calendar-container">
        {dataLoaded ? <Calendar compact={windowDimensions.width<=768} bordered renderCell={renderCell} onChange={(e)=>setSelectedDate(convertUtcToLocal(e))}/> : <Placeholder.Graph active height={700}/>}
    </div>
    <div className="calendar-day-info-container">
      {dataLoaded ? <Panel bordered className="calendar-day-info-panel">
        <div className="calendar-day-info-title">
          <h2>{selectedDate} </h2><p>{dateDifferenceMessage(new Date(currentTime), new Date(selectedDate))}</p>
        </div>
        <div className="calendar-day-info-content">
          <PanelGroup accordion bordered={dateTasks.length == 0 && dateReviewSessions.length == 0 && dateAddedTasks.length == 0 ? false : true}>
            {dateTasks.length == 0 && dateReviewSessions.length == 0 && dateAddedTasks.length == 0 && <p style={{textAlign: 'center', padding: '20px', marginBottom: '20px'}}>No data</p>}
            {dateTasks.length > 0 && dateTasks.map((task)=>{
              return <Panel header={
                <span className="calendar-panel-header"><Badge className="calendar-badge next-review"/> <strong>Todo -&nbsp;</strong>review {task.name}</span>
              } expanded={expandedTasks[task.id]} onClick={()=>handleClickTask(task.id, true)} id={`task-${task.id}`}>
                <div className="calendar-detail">
                  <div className="description">
                    Description: {task.description ? task.description : 'None'}
                  </div>
                  <div className="previous-review">
                    Previous review: {convertUtcToLocal(task.prev_review_date)} ({new Date(task.prev_review_date).toLocaleTimeString()})
                  </div>
                  <div className="quality">
                    Quality: {task.quality}
                  </div>
                  <div className="repetitions">
                    Repetitions: {task.repetitions}
                  </div>
                </div>
              </Panel>
            })}

            {dateAddedTasks.length > 0 && dateAddedTasks.map((task)=>{
              return <Panel header={
                <span className="calendar-panel-header"><Badge className="calendar-badge add"/> Added {task.name}</span>
              } expanded={expandedTasks[task.id]} onClick={()=>handleClickTask(task.id, true)} id={`task-${task.id}`}>
                <div className="calendar-detail">
                  <div className="description">
                    Description: {task.description ? task.description : 'None'}
                  </div>
                  <div className="time-added">
                    Time added: {(new Date(task.date_added)).toLocaleTimeString()}
                  </div>
                </div>
              </Panel>
            })}

            {dateReviewSessions.length > 0 && dateReviewSessions.map((reviewSession)=>{
              let task = tasks.filter((task)=>task.id == reviewSession.task)[0]
              return <Panel header={
                <span className="calendar-panel-header"><Badge className="calendar-badge review"/> Reviewed {task.name}</span>
              } expanded={expandedReviews[reviewSession.id]} onClick={()=>handleClickReview(reviewSession.id, true)} id={`review-${reviewSession.id}`}>
                <div className="calendar-detail">
                  <div className="description">
                    Description: {task.description ? task.description : 'None'}
                  </div>
                  <div className="time-elapsed">
                    Time spent: {secondsToHms(reviewSession.time_elapsed)} ({(new Date(reviewSession.time_started)).toLocaleTimeString()} - {(new Date(reviewSession.time_finished)).toLocaleTimeString()})
                  </div>
                  <div className="quality">
                    New quality: {reviewSession.quality}
                  </div>
                </div>
              </Panel>
            })}

          </PanelGroup>
        </div>
      </Panel> : <Placeholder.Graph active height={300}/>}
    </div>
    </>
  )
}
