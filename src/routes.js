import {useContext} from 'react'
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Logout from './layouts/Logout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Charts from './pages/Charts';
import Report from './pages/Report';
import Notification from './pages/Notifications';
import Doctordashboard from './pages/Doctordashboard';
import NotFound from './pages/Page404';

import PatientForm from './sections/authentication/register/PatientForm'

import MyProfile from './sections/@dashboard/user/MyProfile'

import { UserContext } from './hooks/UserContext';

// ----------------------------------------------------------------------

export default function Router() {
  const { user} = useContext(UserContext);
  const obj = JSON. parse(user)
  var LINK="/dashboard/app"
  if(obj && obj['is_medical']){LINK=`/dashboard/staff`}
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: (obj && obj['is_medical']?<Navigate to='/dashboard/staff'/>:<DashboardApp />) },
        { path: 'staff', element:(obj && obj['is_medical']?<Doctordashboard />:<Navigate to='/dashboard/app'/>)},
        { path: 'user', element:<MyProfile /> },
        { path: 'charts', element: <Charts /> },
        { path: 'reports', element: <Report /> },
        { path: 'notifications', element: <Notification /> }
      ]
    },
    {
      path: '/logout',
      element: <Logout />
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to={LINK} /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'patient', element: <PatientForm /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
