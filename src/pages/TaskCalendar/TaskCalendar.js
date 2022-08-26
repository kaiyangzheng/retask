import React, {useState, useEffect} from 'react';
import {
    Calendar,
    Badge,
    Whisper,
    Popover,
    Placeholder,
    Panel,
    List
} from 'rsuite';
import { convertUtcToLocal } from '../../utils/dateHelpers';
import './Calendar.css';

export default function TaskCalendar({tasks, reviewSessions, dataLoaded, currentTime}) {
  const [selectedDate, setSelectedDate] = useState(convertUtcToLocal(new Date()));
  const [dateReviewSessions, setDateReviewSessions] = useState([]);
  const [dateTasks, setDateTasks] = useState([]);
  const [dateAddedTasks, setDateAddedTasks] = useState([]);

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
        <li>
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                {list.map((task, index)=>{
                  return <>
                  {task.type == 'dateTask' &&
                    <p className="calendar-item"><strong>Todo - </strong> review {task.name}</p>}
                  {task.type == 'dateReviewSession' && 
                    <p className="calendar-item">Reviewed {tasks.filter((taski) => taski.id ===task.task)[0].name}</p>}
                  {task.type == 'dateAddedTask' && 
                    <p className="calendar-item">Added {task.name}</p>}

                  </>
                })}
              </Popover>
            }
          >
            <a>{moreCount} more</a>
          </Whisper>
        </li>
      );

      return <ul className="calendar-list">
        {displayList.map((task, index)=>{
          return <li key={index} className="calendar-item">
            <Badge/> {task.type == 'dateReviewSession' && 
                      `Reviewed ${tasks.filter((taski) => taski.id ===task.task)[0].name}`}
                    {task.type == 'dateAddedTask' && 
                      `Added ${task.name}`}
                    {task.type == 'dateTask' &&
                     <span><strong>Todo - </strong> <span>review {task.name}</span></span>}
          </li>
        })}
        {moreCount ? moreItem : null}
      </ul>
    }else{
      return null;
    }
  }
  return (
    <>
    <div className="calendar-container">
        {dataLoaded ? <Calendar bordered renderCell={renderCell} onChange={(e)=>setSelectedDate(convertUtcToLocal(e))}/> : <Placeholder.Graph active height={700}/>}
    </div>
    <div className="calendar-day-info-container">
      {dataLoaded ? <Panel bordered className="calendar-day-info-panel">
        <div className="calendar-day-info-title">
          <h2>{selectedDate}</h2>
        </div>
        <div className="calendar-day-info-content">
          <Panel accordian bordered={dateTasks.length == 0 && dateReviewSessions.length == 0 && dateAddedTasks.length == 0 ? false : true}>
            {dateTasks.length == 0 && dateReviewSessions.length == 0 && dateAddedTasks.length == 0 ? <p style={{textAlign: 'center'}}>No data</p> : 
            <div>
            {dateTasks.length > 0 && dateTasks.map((task)=>{
              return <Panel header={task.name}></Panel> 
            })}
            </div>}
          </Panel>
        </div>
      </Panel> : <Placeholder.Graph active height={300}/>}
    </div>
    </>
  )
}
