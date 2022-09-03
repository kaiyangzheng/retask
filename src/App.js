import React, {useState, useEffect} from 'react';
import './App.css';
import 'rsuite/dist/rsuite.min.css';
import Appbar from './components/Appbar/Appbar';
import Sidebar from './components/Sidebar/Sidebar';
import { CustomProvider } from 'rsuite';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Calendar from './pages/TaskCalendar/TaskCalendar';
import Dashboard from './pages/Dashboard/Dashboard';
import Friends from './pages/Friends/Friends';
import AddModal from './components/Modals/AddModal/AddModal';
import ReviewModal from './components/Modals/ReviewModal/ReviewModal';
import EditModal from './components/Modals/EditModal/EditModal';
import ModifyModal from './components/Modals/ModifyModal/ModifyModal';
import GoalsModal from './components/Modals/GoalsModal/GoalsModal';
import AddFriendModal from './components/Modals/AddFriendModal/AddFriendModal';
import FriendRequestModal from './components/Modals/FriendRequestModal/FriendRequestModal';
import {
  getUsers,
  getTasks,
  getGoals,
  getReviewSessions,
  getFriendRequests,
  getTaskTypes,
  getTaskStats,
  getPersonalInfo
} from './utils/getData';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [navColor, setNavColor] = useState('#fff');
  const [loginInfo, setLoginInfo] = useState({
    isLoggedIn: false,
    username: '',
    access: '',
    refresh: '',
  });
  const [currentTime, setCurrentTime] = useState();
  const [prevDataLoad, setPrevDataLoad] = useState();
  const [reloadData, setReloadData] = useState(0);

  // data 
  const [dataLoaded, setDataLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [personalInfo, setPersonalInfo] = useState({});
  const [users, setUsers] = useState({});
  const [goals, setGoals] = useState({});
  const [reviewSessions, setReviewSessions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskStats, setTaskStats] = useState([]);

  // modal 
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [openGoalsModal, setOpenGoalsModal] = useState(false);
  const [openAddFriendModal, setOpenAddFriendModal] = useState(false);
  const [openFriendRequestsModal, setOpenFriendRequestsModal] = useState(false);

  // task actions
  const [reviewTaskId, setReviewTaskId] = useState(null);
  const [reviewSessionId, setReviewSessionId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [modifyType, setModifyType] = useState(null);

  useEffect(()=>{
    const timer = setInterval(()=>{
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, [])

  useEffect(() => {
    const getData = async () => {
      setDataLoaded(false);
      await getUsers(setUsers);
      await getPersonalInfo(setPersonalInfo);
      await getTasks(setTasks);
      await getGoals(setGoals);
      await getReviewSessions(setReviewSessions);
      await getFriendRequests(setFriendRequests);
      await getTaskTypes(setTaskTypes);
      await getTaskStats(setTaskStats);
      setDataLoaded(true);
    }
    if (loginInfo.isLoggedIn){
      getData();
    }
  }, [loginInfo, reloadData]);

  //hacky; prefer websockets
  useEffect(()=>{
    const getData = async () => {
      await getFriendRequests(setFriendRequests);
      await getPersonalInfo(setPersonalInfo);
    }

    if (loginInfo.isLoggedIn){
      if (dataLoaded){
        getData();
      }
    }

  }, [currentTime])

  useEffect(() => {
    if (currentTime && prevDataLoad){
      let currentTimeDate = new Date(currentTime);
      let currentTimeDay = currentTimeDate.getDate();
      let currentTimeMonth = currentTimeDate.getMonth();
      let currentTimeYear = currentTimeDate.getYear();
      let prevDataLoadDay = prevDataLoad.getDate();
      let prevDataLoadMonth = prevDataLoad.getMonth();
      let prevDataLoadYear = prevDataLoad.getYear();
      if (currentTimeDay > prevDataLoadDay || currentTimeMonth > prevDataLoadMonth || currentTimeYear > prevDataLoadYear){
        setReloadData(!reloadData);
      }
    }
  }, [currentTime])
  
  useEffect(()=>{
    if (theme === 'light'){
        setNavColor('#000');
    } else {
        setNavColor('#fff');
    }
  }, [theme])

  useEffect(()=>{
    if (localStorage.getItem('isLoggedIn') === 'true'){
      setLoginInfo({
        isLoggedIn: true,
        username: localStorage.getItem('username'),
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token'),
      })
    } 
  }, [])  

  return (
    <CustomProvider theme={theme}>
      <div className="App">
        <AddModal openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} reloadData={reloadData} setReloadData={setReloadData} setOpenReviewModal={setOpenReviewModal} setReviewTaskId={setReviewTaskId} setReviewSessionId={setReviewSessionId}/>
        <ReviewModal openReviewModal={openReviewModal} setOpenReviewModal={setOpenReviewModal} reloadData={reloadData} setReloadData={setReloadData} reviewTaskId={reviewTaskId} reviewSessionId={reviewSessionId} tasks={tasks}/>
        <EditModal openEditModal={openEditModal} setOpenEditModal={setOpenEditModal} reloadData={reloadData} setReloadData={setReloadData} editTaskId={editTaskId} tasks={tasks}/>
        <ModifyModal tasks={tasks} taskTypes={taskTypes} currentTime={currentTime} users={users} dataLoaded={dataLoaded} openModifyModal={openModifyModal} setOpenModifyModal={setOpenModifyModal} type={modifyType} reloadData={reloadData} setReloadData={setReloadData} setEditTaskId={setEditTaskId} setOpenEditModal={setOpenEditModal}/>
        <GoalsModal openGoalsModal={openGoalsModal} setOpenGoalsModal={setOpenGoalsModal} reloadData={reloadData} setReloadData={setReloadData} goals={goals}/>
        <AddFriendModal openAddFriendModal={openAddFriendModal} setOpenAddFriendModal={setOpenAddFriendModal} reloadData={reloadData} setReloadData={setReloadData} users={users}/>
        <FriendRequestModal openFriendRequestsModal={openFriendRequestsModal} setOpenFriendRequestsModal={setOpenFriendRequestsModal} friendRequests={friendRequests} reloadData={reloadData} setReloadData={setReloadData} personalInfo={personalInfo} users={users} dataLoaded={dataLoaded}/>
        <BrowserRouter>
        <Appbar theme={theme} setTheme={setTheme} navColor={navColor} loginInfo={loginInfo}/>
          <Sidebar navColor={navColor} loginInfo={loginInfo} setLoginInfo={setLoginInfo}>
            <Routes>
              <Route path="/" element={<Landing loginInfo={loginInfo}/>}/>
              <Route path="/login" element={<Login
                setLoginInfo={setLoginInfo}
              />}/>
              <Route path="/register" element={<Register 
                setLoginInfo={setLoginInfo}
              />} />
              <Route path="/home" element={<Home
                loginInfo={loginInfo}
                dataLoaded={dataLoaded}
                currentTime={currentTime}
                reviewSessions={reviewSessions}
                tasks={tasks}
                taskTypes={taskTypes}
                taskStats={taskStats}
                openAddModal={openAddModal}
                setOpenAddModal={setOpenAddModal}
                reloadData={reloadData}
                setReloadData={setReloadData}
                setReviewTaskId={setReviewTaskId}
                setReviewSessionId={setReviewSessionId}
                setOpenReviewModal={setOpenReviewModal}
                setEditTaskId={setEditTaskId}
                setOpenEditModal={setOpenEditModal}
                setModifyType={setModifyType}
                setOpenModifyModal={setOpenModifyModal}
                setOpenGoalsModal={setOpenGoalsModal}
                goals={goals}
                setGoals={setGoals}
                theme={theme}
                users={users}
              />} />
              <Route path="/dashboard" element={<Dashboard
                tasks={tasks}
                reviewSessions={reviewSessions}
                taskStats={taskStats}
                goals={goals}
                dataLoaded={dataLoaded}
                theme={theme}
              />}/>
              <Route path="/calendar" element={<Calendar
                tasks={tasks}
                reviewSessions={reviewSessions}
                dataLoaded={dataLoaded}
                currentTime={currentTime}
              />}/>
              <Route path="/friends" element={<Friends
                dataLoaded={dataLoaded}
                personalInfo={personalInfo}
                users={users}
                setOpenAddFriendModal={setOpenAddFriendModal}
                setOpenFriendRequestsModal={setOpenFriendRequestsModal}
              />}/>
            </Routes>
          </Sidebar>
        </BrowserRouter>
      </div>
    </CustomProvider>
  );
}

export default App;
