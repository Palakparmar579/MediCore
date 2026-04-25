import './App.css';
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import ProtectedRoute from './pages/admin/ProtectedRoute';
import Login from './pages/auth/Login';
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ManageRoles from './pages/admin/ManageRoles';
import Dashboard from './pages/admin/Dashboard';
import PatientDashboard from './pages/patients/DashBoard';
import NurseDashboard from './pages/nurse/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import Forget from "./pages/auth/Forget"
import NoRequests from './pages/admin/Request';
import { Toaster } from "react-hot-toast";
import CommonLayout from './Layout/CommonLayout'
import Department from './pages/admin/Department'
import Appointment from './pages/patients/Appointment';
import AssignDepartment from "./pages/admin/AssignDepartment"
import AppointmentTable from './pages/doctor/AppintmentTable';
import Profile from './pages/admin/Profile';
import PatientProfile from './pages/patients/Profile';
import NurseProfile from './pages/nurse/Profile';
import DoctorProfile from './pages/doctor/Profile';
function App(){ 
return(
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />
         <Route path="/login" element={<Login />} />
          <Route path='/forgetpass' element={<Forget/>}/> 
         <Route element={<ProtectedRoute />}>


        {/* Admin Layout with nested pages */}
        <Route path="/admin" element={<CommonLayout/>}>
         {/* Default page */}
         <Route index element={<Navigate to ='Dashboard' replace/>} />
         <Route path="dashboard" element={<Dashboard />} />
        <Route path="manageRoles" element={<ManageRoles />} />
        <Route path="requests" element={<NoRequests />} />
        <Route path="department" element={<Department/>}/>
        <Route path="assignDepartment" element={<AssignDepartment/>}/>
         <Route path="profile" element={<Profile/>}/>
        </Route> {/* <-- Properly close the parent Route */}

        <Route path='/doctor' element={<CommonLayout/>}>
        <Route index element={<Navigate to ='Dashboard' replace/>} />
        <Route path='dashboard' element={<DoctorDashboard/>}/>
        <Route path='appointment' element={<AppointmentTable/>}/>
        <Route path="profile" element={<DoctorProfile/>}/>
        </Route>
        {/* Doctor */}

         <Route path='/patient' element={<CommonLayout/>}>
       <Route index element={<Navigate to ='Dashboard' replace/>} />
        <Route path='dashboard' element={<PatientDashboard/>}/>
        <Route path='appointment' element={<Appointment/>}/>
        <Route path="profile" element={<PatientProfile/>}/>
        </Route>

         <Route path='/nurse' element={<CommonLayout/>}>
        <Route index element={<Navigate to ='Dashboard' replace/>} />
        <Route path='dashboard' element={<NurseDashboard/>}/>
        <Route path="profile" element={<NurseProfile/>}/>

        </Route>
        </Route>
      </Routes>
        <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <Toaster
  position="top-center"
  reverseOrder={false}
  autoClose={2000}
/>
    </BrowserRouter>

    //<Navbar/>
  );
}

export default App;