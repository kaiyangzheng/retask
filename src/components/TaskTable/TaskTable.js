import React from 'react'
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

export default function TaskTable({ tasks, taskTypes, dataLoaded, currentTime, user }) {
  const { Column, HeaderCell, Cell } = Table;
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
                >
                    <Column fixed flexGrow={2}>
                        <HeaderCell>Task</HeaderCell>
                        <Cell dataKey="name"/>
                    </Column>
                    <Column>
                        <HeaderCell>Date Added</HeaderCell>
                        <Cell>
                            {rowData => (
                                <span>
                                    {convertUtcToLocal(rowData.date_added)}
                                </span>
                            )}
                        </Cell>
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Repetitions</HeaderCell>
                        <Cell dataKey="repetitions"/>
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Quality</HeaderCell>
                        <Cell dataKey="quality"/>
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Ease Factor</HeaderCell>
                        <Cell dataKey="ease_factor"/>
                    </Column>
                    <Column width={150}>
                        <HeaderCell>Prev. Review Date</HeaderCell>
                        <Cell>
                            {rowData => (
                                <span>
                                    {rowData.prev_review_date == null ? 'None' : convertUtcToLocal(rowData.prev_review_date)}
                                </span>
                            )}
                        </Cell>
                    </Column>
                    <Column width={150}>
                        <HeaderCell>Next Review Date</HeaderCell>
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
                    <Column width={250}>
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
                    <Column width={200}>
                        <HeaderCell>Users</HeaderCell>
                        <Cell>
                            <span className="user-pill" style={{
                                background: stringToColor(user.username[0])
                            }}>{user.username}</span>
                        </Cell>
                    </Column>
                    <Column width={100} align="right">
                        <HeaderCell><MoreIcon/></HeaderCell>
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
                                            <Dropdown.Item eventKey={1} disabled={rowData.prev_review_date != null && convertUtcToLocal(rowData.next_review_date) != convertUtcToLocal(currentTime)}>Review</Dropdown.Item>
                                            <Dropdown.Item eventKey={2}>Edit</Dropdown.Item>
                                            <Dropdown.Item eventKey={3}>Delete</Dropdown.Item>
                                            <Dropdown.Item eventKey={4}>Task page</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Popover>
                                    );
                                }}>
                                <IconButton icon={<MoreIcon/>} appearance="subtle"/>
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
