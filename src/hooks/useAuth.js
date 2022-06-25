import { useState, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { UserContext } from './UserContext'; 

export default function useAuth() {
    const defaultSize = {
        fontSize: 18
    }

    const bigSize = {
        fontSize: 50
    }

    const smallSize = {
        fontSize: 14
    }

    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [err, setErr] = useState(null);
    const [userlist,setUserlist] = useState([])
    const [fontSize, setFontSize] = useState(defaultSize);

    let doc=0

    //set user
    const setUserContext = async () => {
        return await axiosInstance.post('verify/')
        .then(res => { 
            const obj = JSON.parse(res.data)
            setUser(res.data); 
            if(obj["is_medical"]==true){
                navigate('/dashboard/staff')
                location.reload()
            }else{
                navigate('/dashboard/app')
                location.reload()
            }               
        })
        .catch((err) => {
            setErr(err.response.data);
        })
        
    }

    //register user  
    const registerUser = async (name, email, phone, password, is_medical,hospname=null,address=null,city=null,state=null,pincode=null) => {
        
        
        return axiosInstance.post('profile/',{name,email,password,phone,is_medical})
        .then((res)=>{
            if(is_medical){
                // console.log(res.data['id'])
                axiosInstance.post('medstaff/',{medstaff:res.data['id'],hospname,address,city,state,pincode}) 
                .then((res)=>navigate('/login'))    
                .catch(err=>setErr(err.response.data))          
            }
            navigate('/login')
            
        })
        .catch((err)=>{
            
            if('email' in err.response.data){
                setErr(err.response.data.email[0])
            }
            else if('phone' in err.response.data){
                setErr(err.response.data.phone[0])
            }
            else{
                console.log(err)
            }
        })
        
        };

    //login user 
    const loginUser = async (email,password) => {
        return (axiosInstance.post(`/auth/token/`, {
          email,
          password,
        })
        .then((res) => {
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            axiosInstance.defaults.headers['Authorization'] =
            'JWT ' + localStorage.getItem('access_token');
        
            setUserContext();
        })
        .catch((err)=>{
            setErr(err.response.data.detail)
        }))
    };

    

    const changeFont = (size) => {
        // console.log("Big")
        if(size === 'small') {
            setFontSize(smallSize)
        }
        if(size === 'default') {
            setFontSize(defaultSize)
        }
        if(size === 'big') {
            setFontSize(bigSize)
        }
    }

    const getUserList=async()=>{
        return await axiosInstance.post('verify/')
        .then(res => { 
            const obj = JSON.parse(res.data)

            axiosInstance.get(`getnotpat/${obj['id']}`)
            .then((res)=>{
            if(res.data==="False"){
                setUserlist([])
            }
            else{setUserlist(res.data)}
            
            })
            .catch(err=>setErr(err))
        })
        .catch((err) => {
            setErr(err.response.data);
        })
        
    }

    return {
        registerUser,
        loginUser,
        err,
        fontSize,
        changeFont,
        getUserList,
        userlist
    }

}