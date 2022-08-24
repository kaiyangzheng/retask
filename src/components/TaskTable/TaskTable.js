import React, {useState, useEffect} from 'react'
import {
    Panel, 
    Placeholder,
    Table,
    Popover,
    Dropdown,
    Whisper,
    IconButton
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

export default function TaskTable({ tasks, taskTypes, dataLoaded, currentTime, user, reloadData, setReloadData, setReviewTaskId, setReviewSessionId, setOpenReviewModal }) {
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
    let height = (tasks.length+1)*46;
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
        setReloadData(!reloadData);
        setReviewTaskId(res.data.task);
        setReviewSessionId(res.data.id);
        setOpenReviewModal(true);
    })
    .catch(err => {
        console.log(err);
    })
  }

  return (
    <Panel bordered className="task-table-panel">
        <div className="task-table-content">
            <h1>Tasks</h1>
        </div>
        <div className="task-table-container">
            { !dataLoaded ? 
                <Placeholder.Graph rows={5} columns={5} /> :
                <Table
                    data={tasks}
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
                                        {convertUtcToLocal(rowData.next_review_date)} ({rowData.interval} days)
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
                                let displaySuccess = true;
                                return <>
                                <div className="status-container">
                                    {taskTypes.in_progress.map(task=>{
                                        if (task.id==rowData.id){
                                            displaySuccess = false;
                                            return <StatusPill type="progress" text="In progress"/>
                                        }
                                    })}
                                    {taskTypes.next_up.map(task=>{
                                        if (task.id==rowData.id){
                                            displaySuccess = false;
                                            return <StatusPill type="warning" text="Upcoming"/>
                                        }
                                    })}
                                    {taskTypes.waiting_for_review.map(task=>{
                                        if (task.id==rowData.id){
                                            displaySuccess = false
                                            return <StatusPill type="danger" text="Waiting"/>
                                        }
                                    })}
                                    {convertUtcToLocal(rowData.next_review_date) == convertUtcToLocal(currentTime) && <StatusPill type="danger" text="Due"/>}
                                    {displaySuccess && convertUtcToLocal(rowData.next_review_date) !== convertUtcToLocal(currentTime) && <StatusPill type="success" text="All clear"/>}       
                                    </div>
                                </>
                            }}
                        </Cell>
                    </Column>
                    <Column width={150}>
                        <HeaderCell>Users</HeaderCell>
                        <Cell>
                            <span className="user-pill" style={{
                                background: stringToColor(user.username[0])
                            }}>{user.username}</span>
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
                                            <Dropdown.Item eventKey={1} disabled={rowData.prev_review_date != null && convertUtcToLocal(rowData.next_review_date) != convertUtcToLocal(currentTime)} onClick={()=>handleReviewTask(rowData.id)}>Review</Dropdown.Item>
                                            <Dropdown.Item eventKey={2}>Edit</Dropdown.Item>
                                            <Dropdown.Item eventKey={3} onClick={()=>handleDeleteTask(rowData.id)}>Delete</Dropdown.Item>
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
