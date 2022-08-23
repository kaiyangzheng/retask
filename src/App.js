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
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
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

  // data 
  const [dataLoaded, setDataLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [goals, setGoals] = useState({});
  const [reviewSessions, setReviewSessions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);

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
  }, [loginInfo]);
  
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

  document.title = 'Retask';

  return (
    <CustomProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
        <Appbar theme={theme} setTheme={setTheme} navColor={navColor} loginInfo={loginInfo}/>
          <Sidebar navColor={navColor} loginInfo={loginInfo} setLoginInfo={setLoginInfo}>
            <Routes>
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
              />} />
            </Routes>
          </Sidebar>
        </BrowserRouter>
      </div>
    </CustomProvider>
  );
}

export default App;
