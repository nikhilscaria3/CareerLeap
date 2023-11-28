
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
import { AdminUserInfo } from './components/AdminPageBrotoUser';
import { ManifestAdmin } from './components/manifestAdmin'
import { ManifestUser } from './components/manifestUser';
import { Message } from './components/messageadmin';
import { UserMessage } from './components/messageUser';
import JsCompiler from './components/jscompiler';
import PDFUploader from './components/createPdf';
import GetPdf from './components/getpdfuser';
import ChatComponent, { GlobalMessage } from './components/GlobalMessage';
import AddQ2AndA from './components/addquestionandans';
import DisplayQuestions from './components/FumigationQuestions';
import DisplayQuestionAndAnswers from './components/displayqnsAndans';
import { AdminFumigationUserInfo } from './components/AdminPageFumigationUser';
import ForgotPassword from './components/forgetUserPassword';
import AdminChatComponent from './components/ChatComponent';
import UserChatComponent from './components/ReceiverChatComponent';
import PythonCompiler from './components/pythoncompiler';
import CameraFeed from './components/camera';
import OTPForm from './components/otpauthlogin';
import GoogleLogin from './components/GoogleLogin';
import GoogleCallback from './components/GoogleCallback';
import Elearning from './components/homepage';
import { PrivateRoute, PrivateAdminRoute } from './components/PrivateRoutes';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Initialize the socket connection

function App() {
  const apiKey = 'AIzaSyCWCKu2TLYdXnMlNf0LsbsJfhXtEXenEhM';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/loginotp" element={<OTPForm />} />
        <Route path="/auth/google" element={<GoogleLogin />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/" element={<Elearning />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/userforgotpassword" element={<ForgotPassword />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />

        {/* Admin */}

        <Route path="/createplaylist" element={<PrivateAdminRoute component={CreatePlaylists} />} />
        <Route path="/addquestions" element={< PrivateAdminRoute component={AddQ2AndA} />} />
        <Route path="/courseadd" element={<PrivateAdminRoute component={AdminPage} />} />
        <Route path="/weektaskinfocreate" element={<PrivateAdminRoute component={WeekTaskInfoCreate} />} />
        <Route path="/admin/user" element={<PrivateAdminRoute component={AdminUserInfo} />} />
        <Route path="/admin/fumigationuser" element={<PrivateAdminRoute component={AdminFumigationUserInfo} />} />
        <Route path="/admin/manifest" element={<PrivateAdminRoute component={ManifestAdmin} />} />
        <Route path="/admin/message" element={<PrivateAdminRoute component={Message} />} />
        <Route path="/Createpdf" element={<PrivateAdminRoute component={PDFUploader} />} />
        <Route path="/AdminChat" element={<PrivateAdminRoute component={AdminChatComponent} socket={socket} userType="admin" />} />
        {/* User */}

        <Route
          path="/profile"
          element={<PrivateRoute component={ProfilePage} />}
        />
        <Route path="/playlist" element={<PrivateRoute component={() => <YouTubePlaylist apiKey={apiKey} />} />} />
        <Route path="/courses" element={<PrivateRoute component={CoursePage} />} />
        <Route path="/weektask" element={<PrivateRoute component={WeekTask} />} />
        <Route path="/weektaskinfo" element={<PrivateRoute component={WeekTaskInfo} />} />
        <Route path="/testtimer" element={<PrivateRoute component={CountdownTimer} />} />
        <Route path="/BrotoPlaylist" element={<PrivateRoute component={() => <YouTubeBrotoPlaylist apiKey={apiKey} />} />} />
        <Route path="/manifest" element={<PrivateRoute component={ManifestUser} />} />
        <Route path="/user/message" element={<PrivateRoute component={UserMessage} />} />
        <Route path="/jscompiler" element={<PrivateRoute component={JsCompiler} />} />
        <Route path="/Global" element={<PrivateRoute component={ChatComponent} />} />
        <Route path="/fumigationquestion" element={<PrivateRoute component={DisplayQuestions} />} />
        <Route path="/questionandanswers" element={<PrivateRoute component={DisplayQuestionAndAnswers} />} />
        <Route path="/pdf" element={<PrivateRoute component={GetPdf} />} />

        <Route path="/UserChat" element={<PrivateRoute component={UserChatComponent} socket={socket} userType="user" />} />
        <Route path="/PythonCompiler" element={<PrivateRoute component={PythonCompiler} />} />
        <Route path="/camera" element={<PrivateRoute component={CameraFeed} />} />
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
