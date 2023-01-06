import React, {useState, useEffect} from 'react'
import {
    Panel,
    Placeholder,
    Table,
    IconButton,
    Whisper,
    Popover,
    Dropdown
} from 'rsuite';
import MoreIcon from '@rsuite/icons/legacy/More';
import StatusPill from '../StatusPill/StatusPill';
import {
    stringToColor 
} from './../../utils/colorHelpers';
import {
    useNavigate
} from 'react-router-dom';
import './GoalTable.css';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

export default function GoalTable({goals, dataLoaded, taskStats, setOpenGoalsModal}) {
  const { Column, HeaderCell, Cell } = Table;
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!goals){
    return null;
  }

  let formattedGoals = [];
  let goalNames = {
    'total_added': 'Total tasks added',
    'average_quality': 'Average quality',
    'average_repetitions': 'Average repetitions',
    'average_time_spent': 'Average time spent'
  }
  for (let key in goals){
    if (key != 'id' && key !='date_added' && key != 'user'){
        formattedGoals.push({
            goal: goalNames[key],
            value: goals[key],
        })
    }
  }
  let tableHeight = (formattedGoals.length*46)+40

  if (!formattedGoals){
    return null;
  }
  return (
    <Panel className="goal-table-panel" bordered> 
        <div className="goal-table-content">
            <h2>Goals</h2>
        </div>
        <div className="goal-table-container">
            {!dataLoaded ? <Placeholder.Graph rows={5} columns={5} /> : 
            <Table bordered data={formattedGoals} height={tableHeight}>
                <Column flexGrow={2} minWidth={100}>
                    <HeaderCell>Goal</HeaderCell>
                    <Cell dataKey="goal"/>
                </Column>
                <Column>
                    <HeaderCell>Value</HeaderCell>
                    <Cell dataKey="value"/>
                </Column>
                {!taskStats.message && <Column width={105}>
                    <HeaderCell>Status</HeaderCell>
                    {goals && <Cell>
                        {rowData=>{
                            let total_tasks_added_ratio = taskStats.basic_info.total_tasks_added/rowData.value;
                            let average_quality_ratio = taskStats.stats.average_quality/rowData.value;
                            let average_repetitions_ratio = taskStats.stats.average_repetitions/rowData.value;
                            let average_time_spent_ratio = taskStats.stats.average_time_spent/rowData.value;
                            return <div className="status-container">
                                {rowData.goal == 'Total tasks added' && <div>
                                    {total_tasks_added_ratio < 0.5 && <StatusPill type="danger" text="Keep going!"/>}
                                    {total_tasks_added_ratio == 0.5 && <StatusPill type='progress' text="Halfway there!"/>}
                                    {total_tasks_added_ratio > 0.5 && total_tasks_added_ratio < 1 && <StatusPill type="warning" text="So close!"/>}
                                    {total_tasks_added_ratio >= 1 && <StatusPill type="success" text="Success!"/>}
                                </div>}
                                {rowData.goal == 'Average quality' && <div>
                                    {average_quality_ratio < 0.5 && <StatusPill type="danger" text="Keep going!"/>}
                                    {average_quality_ratio == 0.5 && <StatusPill type='progress' text="Halfway there!"/>}
                                    {average_quality_ratio > 0.5 && average_quality_ratio < 1 && <StatusPill type="warning" text="So close!"/>}
                                    {average_quality_ratio >= 1 && <StatusPill type="success" text="Success!"/>}
                                </div>}
                                {rowData.goal == 'Average repetitions' && <div>
                                    {average_repetitions_ratio < 0.5 && <StatusPill type="danger" text="Keep going!"/>}
                                    {average_repetitions_ratio  == 0.5 && <StatusPill type='progress' text="Halfway there!"/>}
                                    {average_repetitions_ratio  > 0.5 && average_repetitions_ratio < 1 && <StatusPill type="warning" text="So close!"/>}
                                    {average_repetitions_ratio  >= 1 && <StatusPill type="success" text="Success!"/>}
                                </div>}
                                {rowData.goal == 'Average time spent' && <div>
                                    {average_time_spent_ratio >= 1.5 && <StatusPill type="danger" text="Keep going!"/>}
                                    {average_time_spent_ratio >= 1.25 && <StatusPill type="warning" text="Almost there!"/>}
                                    {average_time_spent_ratio <= 1 && <StatusPill type="success" text="Success!"/>}
                                </div>}
                            </div>
                        }}
                    </Cell>}
                </Column>}
                <Column width={150}>
                    <HeaderCell>Users</HeaderCell>
                    <Cell>
                        {rowData =>(
                            <span className="user-pill" style={{
                                backgroundColor: stringToColor(localStorage.getItem('username'))
                            }}>
                                {localStorage.getItem('username')}
                            </span>
                        )}
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
                                    };
                                    return (
                                    <Popover ref={ref} className={className} style={{ left, top }} full>
                                        <Dropdown.Menu onSelect={handleSelect}>
                                            <Dropdown.Item eventKey={1} onClick={()=>navigate('/dashboard')}>Dashboard</Dropdown.Item>
                                            <Dropdown.Item eventKey={2} onClick={()=>{setOpenGoalsModal(true); onClose();}}>Edit</Dropdown.Item>
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
            </Table>}
        </div>
    </Panel>
  )
}
