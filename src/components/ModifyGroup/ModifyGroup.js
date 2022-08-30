import React from 'react'
import { Panel, IconButton, Button, ButtonToolbar, ButtonGroup} from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import HeartO from '@rsuite/icons/legacy/HeartO';
import ModifyTasks from '../../svg/ModifyTasks';
import LineChartIcon from '@rsuite/icons/LineChart';
import './ModifyGroup.css';

export default function ModifyGroup({ setOpenAddModal, setModifyType, setOpenModifyModal, setOpenGoalsModal }) {
  return (
    <Panel bordered className="modify-group-panel">
      <div className="modify-group-container">
          <div className="modify-group-title">
              <h2>Modify tasks</h2>
              <p>Add, edit, delete, or favorite tasks</p>
          </div>
          <div className="modify-button-group">
              <IconButton icon={<PlusIcon />} className="modify-button" appearance='primary' color="blue" onClick={()=>setOpenAddModal(true)}/>
              <IconButton icon={<EditIcon />} className="modify-button" appearance='primary' color="cyan" onClick={()=>{
                setOpenModifyModal(true);
                setModifyType('Edit');
              }}/>
              <IconButton icon={<TrashIcon />} className="modify-button" appearance='primary' color='red' onClick={()=>{
                setOpenModifyModal(true);
                setModifyType('Delete');
              }}/>
              <IconButton icon={<HeartO />} className="modify-button" appearance='primary' color='violet' onClick={()=>{
                setOpenModifyModal(true);
                setModifyType('Favorite')
              }}/>
          </div>
          <div className="modify-button-group">
              <IconButton icon={<LineChartIcon style={{
                backgroundColor: '#FF6F61'
              }}/>} className="modify-button-goal" appearance='primary' style={{
                backgroundColor: '#FF6F61',
              }} onClick={()=>setOpenGoalsModal(true)}>Set goals</IconButton>
          </div>
          <div className="modify-group-svg">
              <ModifyTasks />
          </div>
        </div>
    </Panel>
  )
}
