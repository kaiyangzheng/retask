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
import AddModal from './components/Modals/AddModal/AddModal';
import ReviewModal from './components/Modals/ReviewModal/ReviewModal';
import EditModal from './components/Modals/EditModal/EditModal';
import ModifyModal from './components/Modals/ModifyModal/ModifyModal';
import Calendar from './pages/TaskCalendar/TaskCalendar';
import {
  getUser,
  getTasks,
  getGoals,
  getReviewSessions,
  getFriendRequests,
  getTaskTypes
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
  const [reloadData, setReloadData] = useState(0);

  // data 
  const [dataLoaded, setDataLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [goals, setGoals] = useState({});
  const [reviewSessions, setReviewSessions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);

  // modal 
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openModifyModal, setOpenModifyModal] = useState(false);

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
      await getUser(setUser);
      await getTasks(setTasks);
      await getGoals(setGoals);
      await getReviewSessions(setReviewSessions);
      await getFriendRequests(setFriendRequests);
      await getTaskTypes(setTaskTypes);
      setDataLoaded(true);
    }
    if (loginInfo.isLoggedIn){
      getData();
    }
  }, [loginInfo, reloadData]);
  
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
        <ModifyModal tasks={tasks} taskTypes={taskTypes} user={user} currentTime={currentTime} dataLoaded={dataLoaded} openModifyModal={openModifyModal} setOpenModifyModal={setOpenModifyModal} type={modifyType} reloadData={reloadData} setReloadData={setReloadData} setEditTaskId={setEditTaskId} setOpenEditModal={setOpenEditModal}/>
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
                user={user}
                reviewSessions={reviewSessions}
                tasks={tasks}
                taskTypes={taskTypes}
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
              />} />
              <Route path="/calendar" element={<Calendar
                tasks={tasks}
                reviewSessions={reviewSessions}
              />}/>
            </Routes>
          </Sidebar>
        </BrowserRouter>
      </div>
    </CustomProvider>
  );
}

export default App;
