import React, {useEffect, useState} from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { 
    Panel,
    SelectPicker,
    Placeholder
 } from 'rsuite';
import { convertUtcToLocal } from '../../utils/dateHelpers';
import './ProgressLineChart.css';

export default function ProgressLineChart({ reviewSessions, dataLoaded, tasks }) {
  const timeframeSelectData = [
    {label: 'Week', value: 'week'},
    {label: 'Month', value: 'month'},
    {label: 'Year', value: 'year'},
    {label: 'All Time', value: 'allTime'}
  ]
  const [timeframe, setTimeframe] = useState('week');
  const [chartData, setChartData] = useState([]);
  const [chartStrokeColor, setChartStrokeColor] = useState('')

  
  const createWeeklyData = () => {
    let weeklyData = [];
    const now = new Date();
    let weekAgoDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    for (let d = weekAgoDate; d <= now; d.setDate(d.getDate() + 1)) {
        let tasksCompleted = 0;
        reviewSessions.map(session=>{
            if (convertUtcToLocal(d) == convertUtcToLocal(session.time_finished)) {
                tasksCompleted++;
            }
        })
        weeklyData.push({
            date: d.toLocaleDateString('en-US'),
            count: tasksCompleted
        })
    }
    return weeklyData;
  }

  const createMonthlyData = () => {
    let monthlyData = [];
    let now = new Date();
    let monthAgoDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    for (let d = monthAgoDate; d <= now; d.setDate(d.getDate() + 7)) {
        let tasksCompleted = 0;
        reviewSessions.map(session=>{
            for (let i = 0; i < 7; i++) {
                let nextDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
                if (convertUtcToLocal(nextDate) == convertUtcToLocal(session.time_finished)) {
                    tasksCompleted++;
                }
            }
        })
        monthlyData.push({
            date: d.toLocaleDateString('en-US'),
            count: tasksCompleted
        })
    }
    return monthlyData;
  }

  const createYearlyData = () => {
    let yearlyData = [];
    let now = new Date();
    let yearAgoDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    for (let d = yearAgoDate; d <= now; d.setMonth(d.getMonth() + 1)) {
        let tasksCompleted = 0;
        reviewSessions.map(session=>{
            let sessionDate = new Date(session.time_finished);
            if (d.getMonth() == sessionDate.getMonth() && d.getFullYear() == sessionDate.getFullYear()) {
                tasksCompleted++;
            }
        })
        yearlyData.push({
            date: `${d.getMonth() + 1}/${d.getFullYear()}`,
            count: tasksCompleted
        })
    }
    return yearlyData;
  }

  const createAllTimeData = () => {
    let allTimeData = [];
    reviewSessions.sort((a, b)=>{
        return new Date(a.time_finished) - new Date(b.time_finished);
    })
    let uniqueDates = {};
    for (let i = 0; i < reviewSessions.length; i++){
        let isInUniqueDates = false;
        let reviewSessionDate = new Date(reviewSessions[i].time_finished);

        Object.keys(uniqueDates).map(date=>{
            if (convertUtcToLocal(date) === convertUtcToLocal(reviewSessionDate)){
                isInUniqueDates = true;
            }
        })

        if  (!isInUniqueDates){
            uniqueDates[convertUtcToLocal(reviewSessionDate)] = 1;
        }else{
            uniqueDates[convertUtcToLocal(reviewSessionDate)] += 1;
        }

    }
    Object.keys(uniqueDates).map(date=>{
        allTimeData.push({
            date: date, 
            count: uniqueDates[date]
        })
    })
    return allTimeData;
  }
  
  useEffect(()=>{
    if (dataLoaded && reviewSessions.length > 0){
        if (timeframe === 'week'){
            setChartData(createWeeklyData());
            setChartStrokeColor('#8884d8');
        }
        else if (timeframe === 'month'){
            setChartData(createMonthlyData());
            setChartStrokeColor('blue');
        }
        else if (timeframe === 'year'){
            setChartData(createYearlyData());
            setChartStrokeColor('red');
        }
        else if (timeframe === 'allTime'){
            setChartData(createAllTimeData());
            setChartStrokeColor('#82ca9d');
        }
    }else{
        setChartData([]);
    }
  }, [reviewSessions, timeframe, dataLoaded])

  const CustomToolTip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <div className="label">
                {label}
            </div>
            <div className="basic-info">
                # Review sessions: {payload[0].value}
            </div>
            <div className="review-sessions-detail">
                {reviewSessions.filter((reviewSession)=>convertUtcToLocal(reviewSession.time_finished)==label).map((reviewSession, index)=>{
                    let task = tasks.filter(task=>task.id==reviewSession.task)[0];  
                    return <div className="review-session">
                        {index+1}. {task.name}
                    </div>
                })}
            </div>
          </div>
        );
    }
  }


  return (
    <Panel bordered className="progress-line-chart-panel">
        <div className="progress-line-chart-content">
            <h2>At a glance:&nbsp;</h2>
            <SelectPicker data={timeframeSelectData} className="timeframe-select" size="lg" defaultValue={timeframeSelectData[0].value} cleanable={false} onChange={(e)=>{
                setTimeframe(e);
            }}/>
        </div>
        {chartData.length > 0 ? <div className="progress-line-chart-plot">
            {!dataLoaded ? <Placeholder.Graph active/> : 
                <ResponsiveContainer width="99%" aspect={6.5/1}>
                    <LineChart data={chartData} margin={{
                        top: 25, right: 30, left: 20, bottom: 5,
                    }}>
                        <XAxis dataKey="date"/>
                        <YAxis />
                        <Tooltip content={<CustomToolTip/>}/>
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke={chartStrokeColor} activeDot={{r: 8}} name="# Review Sessions"/>
                    </LineChart>
                </ResponsiveContainer>}
        </div> : 
        <div className="progress-line-chart-plot no-plot">
            <p>No review sessions</p>
        </div>}
    </Panel>
  )
}
