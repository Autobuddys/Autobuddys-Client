// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;
let patientID=localStorage.getItem('patientID')

let sidebarConfig =[]

if(patientID){
  sidebarConfig=[
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: getIcon('eva:pie-chart-2-fill')
    },
    {
      title: 'Patient Profile',
      path: '/dashboard/user',
      icon: getIcon('eva:person-fill')
    },
    {
      title: 'Charts',
      path: '/dashboard/charts',
      icon: getIcon('eva:bar-chart-2-fill')
    },
    {
      title: 'Reports',
      path: '/dashboard/reports',
      icon: getIcon('eva:clipboard-fill')
    },
    {
      title: 'Notifications',
      path: '/dashboard/notifications',
      icon: getIcon('eva:bell-fill')
    },
    {
      title: 'Logout',
      path: '/logout',
      icon: getIcon('eva:log-out-fill')
    }
  ]
}
else{
  sidebarConfig = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: getIcon('eva:pie-chart-2-fill')
    },
    {
      title: 'Logout',
      path: '/logout',
      icon: getIcon('eva:log-out-fill')
    }
  ];
  
}


export default sidebarConfig

