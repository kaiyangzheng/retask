import React, {useState, useEffect} from 'react'
import {
    Panel, 
    Placeholder,
    Table,
    Popover,
    Dropdown,
    Whisper,
    IconButton,
    Animation
} from 'rsuite';
import { convertUtcToLocal } from '../../utils/dateHelpers';
import StatusPill from '../StatusPill/StatusPill';
import { stringToColor } from '../../utils/colorHelpers';
import MoreIcon from '@rsuite/icons/legacy/More';
import './TaskTable.css';
import axiosInstance from '../../utils/axiosAPI';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

export default function TaskTable({ tasks, taskTypes, dataLoaded, currentTime, users, reloadData, setReloadData, setReviewTaskId, setReviewSessionId, setOpenReviewModal, setEditTaskId, setOpenEditModal }) {
  const { Column, HeaderCell, Cell } = Table;
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [tableHeight, setTableHeight] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(()=>{
    let height = 40+(tasks.length)*(46);
    if (height > 800){
        height = 800;
    }
    if (tasks.length == 0){
        height = 200;
    }
    setTableHeight(height);
  }, [tasks])

  const handleDeleteTask = async (taskId) => {
    return axiosInstance.delete(`api/v1/task/${taskId}/`)
    .then(res=>{
        console.log(res);
        setReloadData(!reloadData);
    })
    .catch(err=>{
        console.log(err);
    })
  }

  const handleReviewTask = async (taskId) => {
    return axiosInstance.post(`/api/v1/review-session/${taskId}/`)
    .then(res => {
        console.log(res.data);
        setReloadData(!reloadData);
        setReviewSessionId(res.data.id);
        setReviewTaskId(res.data.task);
        setOpenReviewModal(true);
    })
    .catch(err => {
        console.log(err);
    })
  }

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    setOpenEditModal(true);
  }

  return (
    <Panel bordered className="task-table-panel">
        <div className="task-table-content">
            <h2>Tasks</h2>
        </div>
        <div className="task-table-container">
            { !dataLoaded ? 
                <Placeholder.Graph rows={5} columns={5} /> :
                <Table
                    data={tasks.sort((a,b)=>{return new Date(a.date_added)-new Date(b.date_added)})}
                    bordered
                    height={tableHeight}
                >
                    <Column flexGrow={2} minWidth={100}>
                        <HeaderCell>Task</HeaderCell>
                        <Cell dataKey="name"/>
                    </Column>
                    {windowDimensions.width > 1024 && <Column className="h-1024">
                        <HeaderCell>Date Added</HeaderCell>
                        <Cell>
                            {rowData => (
                                <span>
                                    {convertUtcToLocal(rowData.date_added)}
                                </span>
                            )}
                        </Cell>
                    </Column> }
                    {windowDimensions.width > 768 && <Column width={100} className="h-768">
                        <HeaderCell>Repetitions</HeaderCell>
                        <Cell dataKey="repetitions"/>
                    </Column>}
                    {windowDimensions.width > 768 && <Column width={100} className="h-768">
                        <HeaderCell>Quality</HeaderCell>
                        <Cell dataKey="quality"/>
                    </Column>}
                    {windowDimensions.width > 1024 && <Column width={100} className="h-1024">
                        <HeaderCell>Ease Factor</HeaderCell>
                        <Cell dataKey="ease_factor"/>
                    </Column>}
                    {windowDimensions.width> 1024 && <Column width={150} className="h-1024">
                        <HeaderCell>Prev. Review</HeaderCell>
                        <Cell>
                            {rowData => (
                                <span>
                                    {rowData.prev_review_date == null ? 'None' : convertUtcToLocal(rowData.prev_review_date)}
                                </span>
                            )}
                        </Cell>
                    </Column>}
                    <Column width={150}>
                        <HeaderCell>Next Review</HeaderCell>
                        <Cell>
                            {rowData => (
                                <span>
                                    {rowData.next_review_date == null ? 'None' : 
                                    <span>
                                        {convertUtcToLocal(rowData.next_review_date)} ({Math.ceil((new Date(rowData.next_review_date) - new Date(currentTime))/(1000*60*60*24))} days)
                                    </span>
                                    }
                                </span>
                            )}
                        </Cell>
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Status</HeaderCell>
                        <Cell>
                            {rowData => {
                                return <>
                                <div className="status-container">
                                    {taskTypes.in_progress.map(task=>{
                                        if (task.id==rowData.id){
                                            return <StatusPill type="progress" text="In progress"/>
                                        }
                                    })}
                                    {taskTypes.next_up.map(task=>{
                                        if (task.id==rowData.id){
                                            return <StatusPill type="warning" text="Upcoming"/>
                                        }
                                    })}
                                    {taskTypes.waiting_for_review.map(task=>{
                                        if (task.id==rowData.id){
                                            return <StatusPill type="danger" text="Waiting"/>
                                        }
                                    })}
                                    {taskTypes.due.map(task=>{
                                        if (task.id==rowData.id){
                                            return <StatusPill type="danger" text="Due"/>
                                        }
                                    })}
                                    {taskTypes.overdue.map(task=>{
                                        if (task.id==rowData.id){
                                            return <StatusPill type="danger" text="Overdue"/>
                                        }
                                    })}
                                    {taskTypes.all_clear.map(task=>{
                                        if (task.id==rowData.id){
                                            return <StatusPill type="success" text="All clear"/>
                                        }
                                    })}
                                    </div>
                                </>
                            }}
                        </Cell>
                    </Column>
                    <Column width={150}>
                        <HeaderCell>Users</HeaderCell>
                        <Cell>
                            {rowData => {
                                let usernames = [];
                                let taskUsers = [rowData.user];
                                taskUsers.map((user)=>{
                                    let username = users.filter((compareUser)=>compareUser.id == user)[0].username;
                                    usernames.push(username);
                                })
                                return <div className="user-container">
                                    {usernames.map((username)=>{
                                        return <span className="user-pill" style={{
                                            background: stringToColor(username)
                                        }}>
                                            {username}
                                        </span>
                                    })}
                                </div>
                            }}
                        </Cell>
                    </Column>
                    <Column width={100} align="right">
                        <HeaderCell><MoreIcon style={{fontSize: 20, fontWeight: 600}}/></HeaderCell>
                        <Cell style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}>
                            {rowData =>(
                                <Whisper placement="autoVerticalStart" trigger="click" speaker={({ onClose, left, top, className }, ref) => {
                                    const handleSelect = eventKey => {
                                        onClose();
                                        console.log(eventKey);
                                    };
                                    return (
                                    <Popover ref={ref} className={className} style={{ left, top }} full>
                                        <Dropdown.Menu onSelect={handleSelect}>
                                            <Dropdown.Item eventKey={1} disabled={rowData.prev_review_date != null && convertUtcToLocal(rowData.next_review_date) != convertUtcToLocal(currentTime)} onClick={()=>{handleReviewTask(rowData.id); onClose()}}>Review</Dropdown.Item>
                                            <Dropdown.Item eventKey={2} onClick={()=>{handleEditTask(rowData.id); onClose()}}>Edit</Dropdown.Item>
                                            <Dropdown.Item eventKey={3} onClick={()=>{handleDeleteTask(rowData.id); onClose()}}>Delete</Dropdown.Item>
                                            <Dropdown.Item eventKey={4}>Task page</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Popover>
                                    );
                                }}>
                                <IconButton icon={<MoreIcon style={{
                                    fontSize: 20
                                }}/>} appearance="subtle"/>
                            </Whisper>
                            )}
                        </Cell>
                    </Column>
                </Table>
            }
        </div>
    </Panel>
  )
}
