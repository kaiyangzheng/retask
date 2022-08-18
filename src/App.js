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

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  return (
    <CustomProvider theme={theme}>
      <Appbar theme={theme} setTheme={setTheme}/>
      <div className="App">
        <BrowserRouter>
          <Sidebar>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Sidebar>
        </BrowserRouter>
      </div>
    </CustomProvider>
  );
}

export default App;
