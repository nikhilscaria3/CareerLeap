
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import { AdminLoginPage } from './components/AdminLogin';
import YouTubePlaylist from './components/Playlist';
import CoursePage from './components/Courses';
import { CreatePlaylists } from './components/CreatePlaylist';
import { WeekTask } from './components/WeekTask';
import { WeekTaskInfoCreate } from './components/WeekTaskInfoCreate';
import { WeekTaskInfo } from './components/WeekTaskInfo';
import CountdownTimer from './components/testtimer';
import YouTubeBrotoPlaylist from './components/BrototypePlaylist';
import { AdminUserInfo } from './components/AdminPageUser';
import {ManifestAdmin} from './components/manifestAdmin'
import { ManifestUser } from './components/manifestUser';

function App() {
  const apiKey = 'AIzaSyCWCKu2TLYdXnMlNf0LsbsJfhXtEXenEhM';

  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<RegisterPage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/profile" element={<ProfilePage/>}/>
    <Route path="/courseadd" element={<AdminPage/>}/>
    <Route path="/adminlogin" element={<AdminLoginPage/>}/>
    <Route path="/playlist" element={ <YouTubePlaylist apiKey={apiKey} />}/>
    <Route path="/courses" element={ <CoursePage/>}/>
    <Route path="/createplaylist" element={ <CreatePlaylists/>}/>
    <Route path="/weektask" element={ <WeekTask/>}/>
    <Route path="/weektaskinfo" element={ <WeekTaskInfo/>}/>
    <Route path="/weektaskinfocreate" element={ <WeekTaskInfoCreate/>}/>
    <Route path="/testtimer" element={ <CountdownTimer/>}/>
    <Route path="/BrotoPlaylist" element={ <YouTubeBrotoPlaylist apiKey={apiKey}/>}/>
    <Route path="/admin/user" element={ <AdminUserInfo/>}/>
    <Route path="/admin/manifest" element={ <ManifestAdmin/>}/>
    <Route path="/manifest" element={ <ManifestUser/>}/>
  
   </Routes>
   </BrowserRouter>
  );
}

export default App;
