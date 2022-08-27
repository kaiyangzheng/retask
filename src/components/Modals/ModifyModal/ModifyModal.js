import React, {useState, useEffect} from 'react'
import {
    Modal,
    Input,
    InputGroup,
    Table,
    Placeholder,
    IconButton
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { convertUtcToLocal } from '../../../utils/dateHelpers';
import { stringToColor } from '../../../utils/colorHelpers';
import StatusPill from '../../StatusPill/StatusPill';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai'
import axiosInstance from '../../../utils/axiosAPI';
import './ModifyModal.css';

export default function ModifyModal({tasks, taskTypes, users, currentTime, dataLoaded, openModifyModal, setOpenModifyModal, type, reloadData, setReloadData, setEditTaskId, setOpenEditModal}) {
  const { Column, HeaderCell, Cell } = Table;
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [tableHeight, setTableHeight] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const handleClose = () => {
    setOpenModifyModal(false);
    setShowTable(false);
  }

  const handleEdit = (taskId) => {
    setEditTaskId(taskId);
    setOpenEditModal(true);
  }

  const handleDelete = async (taskId) => {
    return axiosInstance.delete(`/api/v1/task/${taskId}/`)
    .then(res=>{
        console.log(res);
        setReloadData(!reloadData);
    })
    .catch(err=>{
        console.log(err);
    })
  }

  const handleFavorite = async (taskId, name, favorite) => {
    return axiosInstance.put(`/api/v1/task/${taskId}/`, {
        'name': name,
        'favorite': favorite 
    })
    .then(res=>{
        console.log(res);
        setReloadData(!reloadData);
    })
    .catch(err=>{
        console.log(err);
    })
  }

  useEffect(()=>{
    let height = 40+(filteredTasks.length)*(46);
    if (height > 800){
        height = 800;
    }
    if (filteredTasks.length == 0){
        height = 200;
    }
    setTableHeight(height);
  }, [filteredTasks])

  useEffect(()=>{
    let newTasks = tasks;
    newTasks.sort((a,b)=>{
        return new Date(a.date_added) - new Date(b.date_added);
    })
    setFilteredTasks(newTasks);
  }, [dataLoaded, tasks])

  useEffect(()=>{
    let filteredTasks = []
    for (let i = 0; i < tasks.length; i++){
        if (tasks[i].name.toLowerCase().indexOf(filterValue.toLowerCase()) > -1){
            filteredTasks.push(tasks[i]);
        }
    }
    filteredTasks.sort((a,b)=>{
        return new Date(a.date_added) - new Date(b.date_added);
    })
    setFilteredTasks(filteredTasks);
  }, [filterValue])

  return (
    <Modal open={openModifyModal} onClose={handleClose} onEntered={()=>setShowTable(true)}>
        <Modal.Header>
            <h3>{type} tasks</h3>
        </Modal.Header>
        <Modal.Body>
            <div className="filter-tasks">
                <InputGroup>
                    <Input value={filterValue} onChange={(e)=>setFilterValue(e)}/>
                    <InputGroup.Addon>
                    <SearchIcon />
                    </InputGroup.Addon>
                </InputGroup>
            </div>
            <div className="tasks-table">
                {dataLoaded && showTable ? <Table bordered data={filteredTasks} height={tableHeight}>
                    <Column flexGrow={2} >
                        <HeaderCell>Task</HeaderCell>
                        <Cell dataKey="name"/>
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Next Review</HeaderCell>
                        <Cell>
                            {rowData => (
                                <span>
                                    {rowData.next_review_date == null ? 'None' : 
                                    <span>
                                        {convertUtcToLocal(rowData.next_review_date)}
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
                    <Column width={125}>
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
                    <Column width={75} align="right">
                        <HeaderCell>Actions</HeaderCell>
                        <Cell style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}>
                            {rowData => {
                                return <>
                                {type=="Edit" && <IconButton icon={<EditIcon/>} style={{
                                    backgroundColor: '#54b9d1',
                                    color: 'white',
                                }} onClick={()=>handleEdit(rowData.id)}/>}
                                {type=="Delete" && <IconButton icon={<TrashIcon/>} style={{
                                    backgroundColor: '#e15241',
                                    color: 'white',
                                }} onClick={()=>handleDelete(rowData.id)}/>}
                                {type=="Favorite" && 
                                <div>
                                    {rowData.favorite ? <AiFillHeart className="modify-favorite-btn" onClick={()=>handleFavorite(rowData.id, rowData.name, false)}/> : <AiOutlineHeart className="modify-favorite-btn" onClick={()=>handleFavorite(rowData.id, rowData.name, true)}/>}
                                </div>}
                                </>
                            }}
                        </Cell>
                    </Column>
                </Table> : <Placeholder.Graph rows={5} columns={5} /> }
            </div>
        </Modal.Body>
    </Modal>
  )
}