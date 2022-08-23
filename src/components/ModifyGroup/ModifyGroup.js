import React from 'react'
import { Panel, IconButton, Button, ButtonToolbar, ButtonGroup} from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import HeartO from '@rsuite/icons/legacy/HeartO';
import ModifyTasks from '../../svg/ModifyTasks';
import './ModifyGroup.css';

export default function ModifyGroup() {
  return (
    <Panel bordered className="modify-group-panel">
      <div className="modify-group-container">
          <div className="modify-group-title">
              <h2>Modify tasks</h2>
              <p>Add, edit, delete, or favorite tasks</p>
          </div>
          <div className="modify-button-group">
              <IconButton icon={<PlusIcon />} className="modify-button" appearance='primary' color="blue"/>
              <IconButton icon={<EditIcon />} className="modify-button" appearance='primary' color="cyan"/>
              <IconButton icon={<TrashIcon />} className="modify-button" appearance='primary' color='red'/>
              <IconButton icon={<HeartO />} className="modify-button" appearance='primary' color='violet'/>
          </div>
          <div className="modify-group-svg">
              <ModifyTasks />
          </div>
        </div>
    </Panel>
  )
}
